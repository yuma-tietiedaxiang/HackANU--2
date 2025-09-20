#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Plan Generator Service
Integrates the plan_generator.py functionality into the web application
"""

import os
import re
import json
from typing import Dict, List
from pathlib import Path
import pdfplumber
# import google.generativeai as genai
from jinja2 import Template
from dateutil.parser import parse as parse_date

# Configure Gemini API
# GEMINI_API_KEY = "AIzaSyAq0w7vITAwbVMy4c3aCfv7p0naJ6IFWOw"
# genai.configure(api_key=GEMINI_API_KEY)

# Helper Functions
def _clean(s: str) -> str:
    return re.sub(r"\s+", " ", s or "").strip()

def _num(s: str) -> float:
    if not s:
        return 0.0
    s = s.replace(",", "")
    m = re.search(r"(\d+(?:\.\d+)?)", s)
    return float(m.group(1)) if m else 0.0

def _split_semicolons(s: str) -> List[str]:
    if not s:
        return []
    return [x.strip() for x in re.split(r";|\n", s) if x.strip()]

def _bullet_lines(block: str) -> List[str]:
    return [_clean(x) for x in re.findall(r"^- (.+)$", block or "", flags=re.M)]

def extract_text_from_pdf(path: str) -> str:
    """Return concatenated text from all pages of a PDF."""
    with pdfplumber.open(path) as pdf:
        chunks = []
        for p in pdf.pages:
            t = p.extract_text() or ""
            chunks.append(t)
        return "\n".join(chunks)

def parse_overview_text(text: str) -> Dict:
    """
    Parse a project overview plan's text into a structured data_dict.
    """
    t = text.replace("\r", "")

    data = {
        "project_title": "",
        "company_name": "",
        "product_name": "",
        "product_summary": "",
        "problem_statement": "",
        "objective": "",
        "key_outcomes": [],
        "start_date": "",
        "end_date": "",
        "milestones": [],
        "budget": {
            "currency": "",
            "total": 0.0,
            "capex": 0.0,
            "opex": 0.0,
            "contingency_percent": 0.0,
            "funding_sources": []
        },
        "sponsor": {"name": "", "role": ""},
        "lead": {"name": "", "role": ""},
        "team": [],
        "stakeholders": [],
        "partners": [],
        "kpis": [],
        "risks": [],
        "reporting": {"deliverables": []},
        "trl_start": None,
        "trl_end": None,
    }

    # Title & (heuristic) company
    m = re.search(r"^Title:\s*(.+)$", t, flags=re.M | re.I)
    if m:
        data["project_title"] = _clean(m.group(1))
        # Heuristic: "<Company> — <Project>" or "<Company> - <Project>"
        if "—" in data["project_title"]:
            data["company_name"] = _clean(data["project_title"].split("—")[0])
        elif " - " in data["project_title"]:
            data["company_name"] = _clean(data["project_title"].split(" - ")[0])

    # Product & Summary
    m = re.search(r"Product:\s*(.+)", t, re.I)
    if m:
        data["product_name"] = _clean(m.group(1))
    m = re.search(r"Summary:\s*(.+)", t, re.I)
    if m:
        data["product_summary"] = _clean(m.group(1))

    # Problem Statement
    m = re.search(r"Problem Statement\s*(.+?)(?:\n\s*\n|Objective\b)", t, re.I | re.S)
    if m:
        data["problem_statement"] = _clean(m.group(1))

    # Objective
    m = re.search(r"Objective\s*(.+?)(?:\n\s*\n|Key Outcomes\b)", t, re.I | re.S)
    if m:
        data["objective"] = _clean(m.group(1))

    # Key Outcomes
    m = re.search(r"Key Outcomes\s*(.+?)(?:\n\s*\n|Timeline\b)", t, re.I | re.S)
    if m:
        data["key_outcomes"] = _bullet_lines(m.group(1))

    # Timeline dates
    m = re.search(r"Start\s*Date:\s*([0-9\-\/]+)\s*\|\s*End\s*Date:\s*([0-9\-\/]+)", t, re.I)
    if m:
        data["start_date"], data["end_date"] = m.group(1), m.group(2)

    # Milestones block
    m = re.search(r"Milestones\s*(.+?)(?:\n\s*\n|Budget\b|People\b)", t, re.I | re.S)
    if m:
        for line in _bullet_lines(m.group(1)):
            # "Name (YYYY-MM-DD, Owner: Role)"
            m2 = re.match(r"(.*?)\s*\((\d{4}-\d{2}-\d{2}),\s*Owner:\s*(.*?)\)\s*$", line)
            if m2:
                data["milestones"].append(
                    {"name": _clean(m2.group(1)), "due": m2.group(2), "owner": _clean(m2.group(3))}
                )
            else:
                data["milestones"].append({"name": line, "due": "", "owner": ""})

    # Budget block
    cur = re.search(r"Currency:\s*([A-Z]{3})", t, re.I)
    tot = re.search(r"Total:\s*([\d,\.]+)", t, re.I)
    cap = re.search(r"Capex:\s*([\d,\.]+)", t, re.I)
    opx = re.search(r"Opex:\s*([\d,\.]+)", t, re.I)
    cont = re.search(r"Contingency:\s*([\d\.]+)\s*%", t, re.I)
    fund = re.search(r"Funding:\s*(.+)", t, re.I)
    if cur:
        data["budget"]["currency"] = cur.group(1).upper()
    if tot:
        data["budget"]["total"] = _num(tot.group(1))
    if cap:
        data["budget"]["capex"] = _num(cap.group(1))
    if opx:
        data["budget"]["opex"] = _num(opx.group(1))
    if cont:
        data["budget"]["contingency_percent"] = float(cont.group(1))
    if fund:
        data["budget"]["funding_sources"] = [x for x in re.split(r";|,", fund.group(1)) if x.strip()]

    # People
    s = re.search(r"Sponsor:\s*(.*?)\s*\((.*?)\)", t, re.I)
    if s:
        data["sponsor"] = {"name": _clean(s.group(1)), "role": _clean(s.group(2))}
    l = re.search(r"Project Lead:\s*(.*?)\s*\((.*?)\)", t, re.I)
    if l:
        data["lead"] = {"name": _clean(l.group(1)), "role": _clean(l.group(2))}
    team_block = re.search(r"Team:\s*(.+?)(?:\n\s*\n|Stakeholders\b)", t, re.I | re.S)
    if team_block:
        members = [x.strip() for x in team_block.group(1).split(";") if x.strip()]
        for mbr in members:
            mm = re.match(r"(.*?)\s*\((.*?)\)", mbr)
            if mm:
                data["team"].append({"name": _clean(mm.group(1)), "role": _clean(mm.group(2))})
            else:
                data["team"].append({"name": _clean(mbr), "role": ""})

    # Stakeholders
    stk = re.search(r"Stakeholders\s*(.+?)(?:\n\s*\n|Partners\b)", t, re.I | re.S)
    if stk:
        data["stakeholders"] = _split_semicolons(stk.group(1))

    # Partners
    prt = re.search(r"Partners\s*(.+?)(?:\n\s*\n|KPIs\b)", t, re.I | re.S)
    if prt:
        data["partners"] = _split_semicolons(prt.group(1))

    # KPIs
    kpi_block = re.search(r"KPIs\s*(.+?)(?:\n\s*\n|Risks\b)", t, re.I | re.S)
    if kpi_block:
        for line in _bullet_lines(kpi_block.group(1)):
            name = _clean(re.split(r"—|-", line)[0])
            target = ""
            measure = ""
            m1 = re.search(r"Target:\s*([^—-]+)", line)
            m2 = re.search(r"Measure:\s*(.+)$", line)
            if m1:
                target = _clean(m1.group(1))
            if m2:
                measure = _clean(m2.group(1))
            data["kpis"].append({"name": name, "target": target, "measure": measure})

    # Risks
    risk_block = re.search(r"Risks\s*(.+?)(?:\n\s*\n|Reporting\b)", t, re.I | re.S)
    if risk_block:
        for line in _bullet_lines(risk_block.group(1)):
            rid = ""
            desc = line
            like = impact = owner = mitigation = ""
            m_id = re.match(r"(R\d+):\s*(.*)", line)
            if m_id:
                rid, desc = m_id.group(1), m_id.group(2)
            m_meta = re.search(r"\(Likelihood:\s*(.*?),\s*Impact:\s*(.*?),\s*Owner:\s*(.*?)\)", desc)
            if m_meta:
                like, impact, owner = _clean(m_meta.group(1)), _clean(m_meta.group(2)), _clean(m_meta.group(3))
                desc = _clean(re.sub(r"\(Likelihood:.*?\)", "", desc))
            m_mit = re.search(r"—\s*Mitigation:\s*(.+)$", line)
            if m_mit:
                mitigation = _clean(m_mit.group(1))
            data["risks"].append(
                {
                    "id": rid or f"R{len(data['risks'])+1}",
                    "description": _clean(desc),
                    "likelihood": like,
                    "impact": impact,
                    "owner": owner,
                    "mitigation": mitigation,
                }
            )

    # Reporting
    rep_block = re.search(r"Reporting\s*(.+?)(?:\n\s*\n|TRL\b|$)", t, re.I | re.S)
    if rep_block:
        for name, due in re.findall(r"^- (.+?)\s*—\s*due\s*([0-9\-\/]+)", rep_block.group(1), flags=re.I | re.M):
            data["reporting"]["deliverables"].append({"name": _clean(name), "due": due})

    # TRL
    m = re.search(r"TRL\s*Start:\s*(\d+)\s*;\s*End:\s*(\d+)", t, re.I)
    if m:
        data["trl_start"] = int(m.group(1))
        data["trl_end"] = int(m.group(2))

    return data

def parse_single_pdf(pdf_filename: str):
    """
    Parse a single company overview PDF into a structured dict.
    """
    raw_text = extract_text_from_pdf(str(pdf_filename))
    single_dict = parse_overview_text(raw_text)
    return single_dict

# LLM Generation Functions
TEMPLATE_SECTIONS = """
Sections to produce (JSON keys):
- aim_text
- objective_text
- scope_text
- implementation_text
- governance_text
- partner_org
- project_budget
- payment_schedule
- miles_outcomes
- reporting
- comms_text
- evaluation_text
- pir_text
"""

SYSTEM_PROMPT = """You write professional project plans using the json structure of a company's project overview.
- Expand bullets into concise, businesslike paragraphs which are 200-300 words for each section in output.
- If content(percentages, numbers, dates,detailed description) exists but is less than desired word limit, invent more using descriptions for each section in TEMPLATE_SECTIONS
- If content in json structure is enough to write 200-300 words, then do not invent more content.
- 'aim_text' description is Write 1–2 plain-English sentences explaining why the project is
being undertaken, its high-level aim, and how it aligns with the organisation's strategic direction.
Include the starting and finishing TRLs from the grant application.
- 'objective_text' should describe how your project will be measured. State 4-5 objective(s) which will stem
from implementation of the project.
- 'scope_text'  should Define the project's scope clearly, stating inclusions and exclusions. Keep
 it concise to guide work plans, budgets, schedules, and expectations.
- if partner_org is missing then write "TBD"
- 'project_budget' should be detailed and in tabular format. you are allowed to invent if there are less than 5 rows and columns.
- 'payment_schedule' should be detailed and in tabular format.
- For 'miles_outcomes', List project milestones and deliverables with their phase, outcomes, dates, and
 success measures. Use the columns: Milestone, Project Phase, Outcomes, Start Date, End Date, Measure of Success.
If the input JSON provides full data for 5 rows, use it; otherwise, create the missing entries.
- Columns for generating table for 'reporting' are deliverables, description and due dates.Example row
entries for deliverables are progress report, evaluation report and final report.
- Show outcomes/results with their success measures in a two-column table. Use items like TRL improvement, IP agreements, industry engagement, commercial readiness, or spinouts. If fewer than 5 rows exist in the JSON, add data to make 5.
- Final 'evaluation_text' is generated in tabular format with first column as outcomes/results
and second column is the measure of success(Improving the TRL of the project,Australia's Economic Accelerator,Increased industry engagement through collaboration, investment, product development
Securing IP, Licensing or Patent agreements for the research). invent data if the json structure gives less than 5 rows.
- DO NOT invent or modify numbers, dates, currencies, percentages or milestone due dates.
- Keep tone neutral and clear.

"""

def generate_plan_text_blocks(canonical):
    # Mock implementation for testing - replace with actual Gemini API when available
    blocks = {
        "aim_text": f"This project aims to develop and commercialize {canonical.get('product_name', 'the product')} to address {canonical.get('problem_statement', 'market needs')}. The project will advance from TRL {canonical.get('trl_start', 5)} to TRL {canonical.get('trl_end', 8)}, creating significant value for {canonical.get('company_name', 'the company')} and the broader industry.",
        
        "objective_text": f"1. Develop a fully functional {canonical.get('product_name', 'product')} prototype\n2. Validate market demand through customer engagement\n3. Establish intellectual property protection strategy\n4. Create scalable manufacturing processes\n5. Achieve commercial readiness and market entry",
        
        "scope_text": f"The project scope includes research and development of {canonical.get('product_name', 'the product')}, market validation, intellectual property development, and preparation for commercialization. This includes technical development, regulatory compliance, and business model validation. Excluded from scope are post-launch marketing activities and ongoing operational support.",
        
        "implementation_text": f"The implementation will follow a structured approach with clear milestones and deliverables. The project team will work collaboratively to develop {canonical.get('product_name', 'the product')} while maintaining focus on quality, compliance, and market readiness. Regular progress reviews and stakeholder engagement will ensure alignment with project objectives.",
        
        "governance_text": f"Project governance will be managed through a steering committee led by {canonical.get('sponsor', {}).get('name', 'Project Sponsor')} and {canonical.get('lead', {}).get('name', 'Project Lead')}. Regular reporting and milestone reviews will ensure project success and stakeholder alignment.",
        
        "partner_org": "TBD",
        
        "project_budget": {
            "columns": ["Category", "Amount (AUD)", "Percentage"],
            "rows": [
                ["Research & Development", f"{canonical.get('budget', {}).get('capex', 0):,.0f}", "60%"],
                ["Personnel", f"{canonical.get('budget', {}).get('opex', 0):,.0f}", "30%"],
                ["Equipment", "50,000", "5%"],
                ["Contingency", f"{canonical.get('budget', {}).get('contingency_percent', 10)}%", f"{canonical.get('budget', {}).get('contingency_percent', 10)}%"]
            ]
        },
        
        "payment_schedule": {
            "columns": ["Milestone", "Amount (AUD)", "Due Date"],
            "rows": [
                ["Project Start", "100,000", canonical.get('start_date', '2024-01-01')],
                ["Phase 1 Complete", "150,000", "2024-06-01"],
                ["Phase 2 Complete", "200,000", "2024-12-01"],
                ["Final Delivery", "100,000", canonical.get('end_date', '2025-01-01')]
            ]
        },
        
        "miles_outcomes": {
            "columns": ["Milestone", "Project Phase", "Outcomes", "Start Date", "End Date", "Measure of Success"],
            "rows": [
                ["Project Initiation", "Planning", "Project setup and team formation", canonical.get('start_date', '2024-01-01'), "2024-02-01", "Team assembled and project plan approved"],
                ["Prototype Development", "Development", "Working prototype created", "2024-02-01", "2024-08-01", "Functional prototype demonstrated"],
                ["Testing & Validation", "Validation", "Product tested and validated", "2024-08-01", "2024-10-01", "Test results meet specifications"],
                ["Commercialization Prep", "Commercialization", "Market entry preparation", "2024-10-01", canonical.get('end_date', '2025-01-01'), "Ready for market launch"]
            ]
        },
        
        "reporting": {
            "deliverables": [
                {"name": "Progress Report", "description": "Quarterly progress updates", "due": "2024-03-31"},
                {"name": "Mid-term Review", "description": "Comprehensive project review", "due": "2024-06-30"},
                {"name": "Final Report", "description": "Project completion report", "due": canonical.get('end_date', '2025-01-01')}
            ]
        },
        
        "comms_text": f"Communication strategy will include regular stakeholder updates, progress reports, and milestone celebrations. The project team will maintain open communication channels with all stakeholders and provide timely updates on project progress and challenges.",
        
        "evaluation_text": {
            "columns": ["Outcomes/Results", "Measure of Success"],
            "rows": [
                ["TRL Improvement", f"Advance from TRL {canonical.get('trl_start', 5)} to TRL {canonical.get('trl_end', 8)}"],
                ["Industry Engagement", "Establish partnerships with 3+ industry partners"],
                ["IP Development", "File 2+ patent applications"],
                ["Commercial Readiness", "Complete market validation and business model"],
                ["Economic Impact", "Create 10+ direct jobs and $1M+ revenue potential"]
            ]
        },
        
        "pir_text": f"Post-implementation review will assess project outcomes against original objectives, evaluate lessons learned, and identify opportunities for future development. The review will inform future project planning and strategic decision-making for {canonical.get('company_name', 'the company')}."
    }
    
    return blocks

def _ensure_table_like(block: Dict[str, any]) -> Dict[str, any]:
    """Ensure a {columns: [...], rows: [...] } shape for table-like data."""
    if not isinstance(block, dict):
        return {"columns": [], "rows": []}
    cols = block.get("columns") or []
    rows = block.get("rows") or []
    # coerce to lists
    cols = list(cols) if isinstance(cols, (list, tuple)) else []
    rows = list(rows) if isinstance(rows, (list, tuple)) else []
    return {"columns": cols, "rows": rows}

def categorize_for_aea_template_llm_only(llm_blocks: Dict[str, any]) -> Dict[str, any]:
    """
    Build a render-ready context using ONLY llm_blocks.
    """
    lb = llm_blocks.copy()

    # --- Narrative strings ---
    aim_text            = _clean(lb.get("aim_text"))
    objective_text      = _clean(lb.get("objective_text"))
    scope_text          = _clean(lb.get("scope_text"))
    implementation_text = _clean(lb.get("implementation_text"))
    governance_text     = _clean(lb.get("governance_text"))
    partner_org         = _clean(lb.get("partner_org"))
    comms_text          = _clean(lb.get("comms_text"))
    pir_text            = _clean(lb.get("pir_text"))

    # --- Structured blocks (tables/dicts) ---
    project_budget   = lb.get("project_budget", {}) or {}
    payment_schedule = lb.get("payment_schedule", {}) or {}
    miles_outcomes   = _ensure_table_like(lb.get("miles_outcomes", {}) or {})
    evaluation_text  = _ensure_table_like(lb.get("evaluation_text", {}) or {})

    # Reporting may be a dict with deliverables (list). Keep both a narrative and a table form.
    reporting_block = lb.get("reporting", {}) or {}
    reporting_narrative = ""
    reporting_table = []
    if isinstance(reporting_block, dict):
        # accept {"deliverables":[{name, description, due_date}]}
        for d in reporting_block.get("deliverables", []) or []:
            if isinstance(d, dict):
                reporting_table.append({
                    "name": _clean(d.get("name", "")),
                    "description": _clean(d.get("description", "")),
                    "due": _clean(d.get("due_date", d.get("due", ""))),
                })
    elif isinstance(reporting_block, str):
        reporting_narrative = _clean(reporting_block)

    # --- Safe defaults for template's factual expectations ---
    project = {
        "title": "Project Plan",
        "objective": "",
        "problem": "",
        "outcomes": [],
        "company": "",
        "product": "",
        "summary": "",
        "trl": {"start": None, "end": None},
    }
    people = {
        "sponsor": {"name": "", "role": ""},
        "lead": {"name": "", "role": ""},
        "team": [],
    }
    schedule = {"start": "", "end": "", "milestones": []}
    budget = {"currency": "AUD", "total": 0, "capex": 0, "opex": 0, "contingency_percent": 0, "funding_sources": []}
    kpis, risks = [], []

    # --- Final context ---
    context = {
        # factual shells (kept empty/safe)
        "project": project,
        "people": people,
        "schedule": schedule,
        "budget": budget,
        "kpis": kpis,
        "risks": risks,

        # narratives
        "aim_text": aim_text,
        "objective_text": objective_text,
        "scope_text": scope_text,
        "implementation_text": implementation_text,
        "governance_text": governance_text,
        "partner_org": partner_org,
        "comms_text": comms_text,
        "pir_text": pir_text,

        # structured blocks from LLM
        "project_budget": project_budget,
        "payment_schedule": payment_schedule,
        "miles_outcomes": miles_outcomes,
        "evaluation_text": evaluation_text,

        # reporting (narrative + table)
        "reporting_narrative": reporting_narrative,
        "reporting_table": reporting_table,
    }
    return context

def generate_project_plan(pdf_filename: str):
    """
    Main function to generate a project plan from a PDF file.
    Returns the generated plan data.
    """
    try:
        # Parse the PDF
        pdf_data = parse_single_pdf(pdf_filename)
        
        # Generate LLM blocks
        llm_blocks = generate_plan_text_blocks(pdf_data)
        
        # Categorize for template
        context = categorize_for_aea_template_llm_only(llm_blocks)
        
        return {
            "success": True,
            "data": context,
            "raw_pdf_data": pdf_data,
            "llm_blocks": llm_blocks
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "data": None
        }

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) != 2:
        print(json.dumps({
            "success": False,
            "error": "Usage: python3 plan_generator_service.py <pdf_path>"
        }))
        sys.exit(1)
    
    pdf_path = sys.argv[1]
    result = generate_project_plan(pdf_path)
    print(json.dumps(result, indent=2, ensure_ascii=False))
