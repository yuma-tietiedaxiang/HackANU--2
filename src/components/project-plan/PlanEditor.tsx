import { useState } from "react";
import React from "react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  FileText,
  Edit,
  Download,
  Save,
  Eye,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Target,
  DollarSign,
  Clock,
  Users,
  Shield,
  Lightbulb,
  ArrowLeft,
  FileCheck,
  Printer,
  Settings,
} from "lucide-react";

interface PlanEditorProps {
  generatedPlan: any;
  companyData: any;
  selectedTemplate: string;
  onBack: () => void;
}

export function PlanEditor({
  generatedPlan,
  companyData,
  selectedTemplate,
  onBack,
}: PlanEditorProps) {
  // Map the generated plan data to the expected format
  const mapPlanData = (data: any) => {
    // Handle both server response structure and frontend parsed structure
    const actualData = data.data || data;

    return {
      ...actualData,
      templateName: actualData.templateName || "Project Management Plan",
      metadata: {
        generatedAt: new Date().toISOString(),
        companyName: companyData.name,
        templateVersion: "1.0",
        lastModified: new Date().toISOString(),
      },
      sections: {
        projectAim:
          actualData.sections?.projectAim ||
          actualData.aim_text ||
          "Project aim will be generated based on your PDF data.",
        scopeAndImplementation:
          actualData.sections?.scopeAndImplementation ||
          `${actualData.scope_text || ""}\n\n${
            actualData.implementation_text || ""
          }`,
        projectObjectives:
          actualData.sections?.projectObjectives ||
          (actualData.objective_text
            ? actualData.objective_text
                .split("\n")
                .map((obj: string, index: number) => ({
                  objective: obj,
                  specific: `Specific details for objective ${index + 1}`,
                  measurable: `Measurable criteria for objective ${index + 1}`,
                  attainable: `Attainable goals for objective ${index + 1}`,
                  timely: `Timeline for objective ${index + 1}`,
                }))
            : []),
        budget: {
          total:
            actualData.sections?.budget?.total || actualData.budget?.total || 0,
          currency:
            actualData.sections?.budget?.currency ||
            actualData.budget?.currency ||
            "AUD",
          totalFunding:
            actualData.sections?.budget?.totalFunding ||
            actualData.budget?.total ||
            0,
          breakdown:
            actualData.sections?.budget?.breakdown ||
            actualData.project_budget?.rows?.map((row: any[]) => ({
              category: row[0],
              amount: row[1],
              percentage: row[2],
              description: row[3] || "",
            })) ||
            [],
        },
        milestones:
          actualData.sections?.milestones ||
          actualData.miles_outcomes?.rows?.map((row: any[]) => ({
            name: row[0],
            phase: row[1],
            outcomes: row[2],
            startDate: row[3],
            endDate: row[4],
            successMeasure: row[5],
            outcome: row[2],
            measure: row[5],
          })) ||
          [],
        riskManagement: {
          assumptions: actualData.sections?.riskManagement?.assumptions || [],
          constraints: actualData.sections?.riskManagement?.constraints || [],
          technical: actualData.sections?.riskManagement?.technical || [],
          external: actualData.sections?.riskManagement?.external || [],
        },
        governance:
          actualData.sections?.governance ||
          actualData.governance_text ||
          "TBD",
        partnerOrg:
          actualData.sections?.partnerOrg || actualData.partner_org || "TBD",
        reporting: actualData.sections?.reporting || {
          narrative: "TBD",
          table: [],
        },
        evaluation: actualData.sections?.evaluation || {
          narrative: "TBD",
          table: [],
        },
      },
    };
  };

  const [planData, setPlanData] = useState(mapPlanData(generatedPlan));
  const [activeSection, setActiveSection] = useState("overview");
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleEdit = (sectionKey: string, value: string) => {
    setIsEditing(sectionKey);
    setEditingValue(value);
  };

  const saveEdit = (sectionKey: string) => {
    const keys = sectionKey.split(".");
    const newPlanData = { ...planData };
    let current = newPlanData.sections;

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }

    current[keys[keys.length - 1]] = editingValue;

    setPlanData(newPlanData);
    setIsEditing(null);
    setEditingValue("");
    setHasUnsavedChanges(true);
  };

  const cancelEdit = () => {
    setIsEditing(null);
    setEditingValue("");
  };

  const downloadPlan = (format: "pdf" | "word" | "python") => {
    let content: string;
    let filename: string;
    let mimeType: string;

    if (format === "python") {
      // Generate Python code with the plan data
      content = generatePythonCode(planData);
      filename = `${companyData.name?.replace(/\s+/g, "_")}_Project_Plan.py`;
      mimeType = "text/x-python";
    } else {
      // For PDF/Word, use JSON for now (can be enhanced later)
      content = JSON.stringify(planData, null, 2);
      filename = `${companyData.name}_Project_Plan.${
        format === "pdf" ? "pdf" : "docx"
      }`;
      mimeType = "application/json";
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generatePythonCode = (data: any) => {
    return `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generated Project Plan
Company: ${data.companyData?.name || "Unknown"}
Generated: ${new Date().toISOString()}
"""

# Project Plan Data Structure
project_plan = {
    "project_info": {
        "title": "${data.project?.title || "Project Plan"}",
        "company": "${data.companyData?.name || "Unknown Company"}",
        "objective": "${data.project?.objective || "Project objective"}",
        "problem_statement": "${data.project?.problem || "Problem statement"}",
        "summary": "${data.project?.summary || "Project summary"}"
    },
    
    "aim_text": """${data.aim_text || "Project aim text"}""",
    
    "objective_text": """${data.objective_text || "Project objectives"}""",
    
    "scope_text": """${data.scope_text || "Project scope"}""",
    
    "implementation_text": """${
      data.implementation_text || "Implementation details"
    }""",
    
    "governance_text": """${data.governance_text || "Governance structure"}""",
    
    "partner_org": "${data.partner_org || "TBD"}",
    
    "project_budget": ${JSON.stringify(data.project_budget, null, 8)},
    
    "payment_schedule": ${JSON.stringify(data.payment_schedule, null, 8)},
    
    "miles_outcomes": ${JSON.stringify(data.miles_outcomes, null, 8)},
    
    "reporting": ${JSON.stringify(data.reporting, null, 8)},
    
    "comms_text": """${data.comms_text || "Communication strategy"}""",
    
    "evaluation_text": ${JSON.stringify(data.evaluation_text, null, 8)},
    
    "pir_text": """${data.pir_text || "Post-implementation review"}""",
    
    "people": {
        "sponsor": ${JSON.stringify(data.people?.sponsor, null, 8)},
        "lead": ${JSON.stringify(data.people?.lead, null, 8)},
        "team": ${JSON.stringify(data.people?.team, null, 8)}
    },
    
    "schedule": {
        "start": "${data.schedule?.start || ""}",
        "end": "${data.schedule?.end || ""}",
        "milestones": ${JSON.stringify(data.schedule?.milestones, null, 8)}
    },
    
    "budget": {
        "currency": "${data.budget?.currency || "AUD"}",
        "total": ${data.budget?.total || 0},
        "capex": ${data.budget?.capex || 0},
        "opex": ${data.budget?.opex || 0},
        "contingency_percent": ${data.budget?.contingency_percent || 0},
        "funding_sources": ${JSON.stringify(
          data.budget?.funding_sources,
          null,
          8
        )}
    },
    
    "kpis": ${JSON.stringify(data.kpis, null, 8)},
    
    "risks": ${JSON.stringify(data.risks, null, 8)},
    
    "reporting_narrative": """${
      data.reporting_narrative || "Reporting narrative"
    }""",
    
    "reporting_table": ${JSON.stringify(data.reporting_table, null, 8)}
}

def print_project_summary():
    """Print a summary of the project plan"""
    print("=" * 60)
    print("PROJECT PLAN SUMMARY")
    print("=" * 60)
    print(f"Project: {project_plan['project_info']['title']}")
    print(f"Company: {project_plan['project_info']['company']}")
    print(f"Budget: {project_plan['budget']['currency']} {project_plan['budget']['total']:,.2f}")
    print(f"Timeline: {project_plan['schedule']['start']} to {project_plan['schedule']['end']}")
    print("=" * 60)

def export_to_json(filename: str = None):
    """Export the project plan to JSON format"""
    import json
    if not filename:
        filename = f"{project_plan['project_info']['company'].replace(' ', '_')}_project_plan.json"
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(project_plan, f, indent=2, ensure_ascii=False)
    
    print(f"Project plan exported to {filename}")

def export_to_markdown(filename: str = None):
    """Export the project plan to Markdown format"""
    if not filename:
        filename = f"{project_plan['project_info']['company'].replace(' ', '_')}_project_plan.md"
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(f"# {project_plan['project_info']['title']}\\n\\n")
        f.write(f"**Company:** {project_plan['project_info']['company']}\\n\\n")
        f.write(f"## Project Aim\\n\\n{project_plan['aim_text']}\\n\\n")
        f.write(f"## Objectives\\n\\n{project_plan['objective_text']}\\n\\n")
        f.write(f"## Scope\\n\\n{project_plan['scope_text']}\\n\\n")
        f.write(f"## Implementation\\n\\n{project_plan['implementation_text']}\\n\\n")
        f.write(f"## Governance\\n\\n{project_plan['governance_text']}\\n\\n")
        f.write(f"## Budget\\n\\n")
        f.write(f"**Total:** {project_plan['budget']['currency']} {project_plan['budget']['total']:,.2f}\\n")
        f.write(f"**CAPEX:** {project_plan['budget']['capex']:,.2f}\\n")
        f.write(f"**OPEX:** {project_plan['budget']['opex']:,.2f}\\n")
        f.write(f"**Contingency:** {project_plan['budget']['contingency_percent']}%\\n\\n")
    
    print(f"Project plan exported to {filename}")

if __name__ == "__main__":
    print_project_summary()
    print("\\nAvailable functions:")
    print("- export_to_json() - Export to JSON format")
    print("- export_to_markdown() - Export to Markdown format")
    print("- print_project_summary() - Print project summary")
`;
  };

  const sections = [
    { id: "overview", label: "Project Overview", icon: Eye },
    { id: "aim", label: "Project aim", icon: Target },
    { id: "objectives", label: "Project objective(s)", icon: Target },
    {
      id: "scope",
      label: "Scope and implementation",
      icon: FileText,
    },
    { id: "participants", label: "Project participants", icon: Users },
    { id: "partners", label: "Partner Organisation(s)", icon: Users },
    {
      id: "budget",
      label: "Project budget",
      icon: DollarSign,
    },
    { id: "milestones", label: "Milestones and Outcomes", icon: Clock },
    { id: "reporting", label: "Reporting", icon: FileText },
    { id: "evaluation", label: "Project evaluation", icon: CheckCircle },
    { id: "risks", label: "Risk management plan", icon: Shield },
    { id: "certification", label: "Certification", icon: FileCheck },
  ];

  const complianceCheck = {
    score: 94,
    issues: [
      {
        type: "warning",
        message: "Consider adding more detail to the IP protection strategy",
      },
      {
        type: "info",
        message: "Budget breakdown meets all template requirements",
      },
    ],
    recommendations: [
      "Add specific patent filing timelines",
      "Include more detailed risk mitigation measures",
      "Consider environmental impact assessment",
    ],
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Regenerate
              </Button>

              <div className="h-6 w-px bg-gray-700" />

              <CardTitle className="text-white flex items-center space-x-2">
                <FileText className="w-5 h-5" />
                <span>{planData.templateName}</span>
              </CardTitle>
            </div>

            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="border-yellow-500 text-yellow-400"
                >
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Unsaved Changes
                </Badge>
              )}

              <Badge
                variant="outline"
                className="border-green-500 text-green-400"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Ready for Download
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <Users className="w-4 h-4" />
              <span>Company: {companyData.name}</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>
                Generated:{" "}
                {new Date(planData.metadata.generatedAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <FileCheck className="w-4 h-4" />
              <span>Template: v{planData.metadata.templateVersion}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate Section
          </Button>

          <Button
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => downloadPlan("word")}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Word
          </Button>

          <Button
            variant="outline"
            onClick={() => downloadPlan("pdf")}
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>

          <Button
            onClick={() => downloadPlan("python")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Python
          </Button>
        </div>
      </div>

      {/* Main Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Section Navigation */}
        <Card className="bg-gray-900/50 border-gray-800 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-white text-sm">Sections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full justify-start ${
                    activeSection === section.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <Tabs value={activeSection} onValueChange={setActiveSection}>
            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Project Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-500/30">
                    <h2 className="text-2xl font-bold text-white mb-2">
                      Innovate Project Management Plan
                    </h2>
                    <p className="text-gray-300 mb-4">
                      Summary of key elements including milestones, budget,
                      reporting and risk management (aligned to AEA template).
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Users className="w-4 h-4" />
                        <span>Company: {companyData.name}</span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>
                          Generated: {new Date().toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2 text-gray-400">
                        <FileCheck className="w-4 h-4" />
                        <span>Template: v1.0</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="aim" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Project aim</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-300 leading-relaxed">
                          {planData.sections.projectAim ||
                            "Project aim will be generated based on your PDF data."}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEdit("projectAim", planData.sections.projectAim)
                        }
                        className="text-gray-400 hover:text-white ml-4"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>

                    {isEditing === "projectAim" && (
                      <div className="space-y-3">
                        <Textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit("projectAim")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="objectives" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Project objective(s)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Array.isArray(planData.sections.projectObjectives) &&
                    planData.sections.projectObjectives.length > 0 ? (
                      planData.sections.projectObjectives.map(
                        (objective: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.4 }}
                            className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-blue-500"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-white">
                                Objective {index + 1}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>

                            <div className="space-y-3">
                              <p className="text-gray-300">
                                {objective.objective}
                              </p>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="text-blue-400">
                                    Specific:
                                  </span>
                                  <p className="text-gray-300">
                                    {objective.specific}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-green-400">
                                    Measurable:
                                  </span>
                                  <p className="text-gray-300">
                                    {objective.measurable}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-yellow-400">
                                    Attainable:
                                  </span>
                                  <p className="text-gray-300">
                                    {objective.attainable}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-purple-400">
                                    Timely:
                                  </span>
                                  <p className="text-gray-300">
                                    {objective.timely}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )
                    ) : (
                      <div className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-gray-500">
                        <p className="text-gray-400">
                          No objectives available. Please regenerate the plan.
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scope" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Scope and implementation of the project
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white text-lg mb-3">Scope</h3>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-300 leading-relaxed">
                            {planData.sections.scopeAndImplementation?.split(
                              "\n\n"
                            )[0] ||
                              "Scope details will be generated based on your PDF data."}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEdit(
                              "scopeAndImplementation",
                              planData.sections.scopeAndImplementation
                            )
                          }
                          className="text-gray-400 hover:text-white ml-4"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white text-lg mb-3">
                        Implementation
                      </h3>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-300 leading-relaxed">
                            {planData.sections.scopeAndImplementation?.split(
                              "\n\n"
                            )[1] ||
                              "Implementation details will be generated based on your PDF data."}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleEdit(
                              "scopeAndImplementation",
                              planData.sections.scopeAndImplementation
                            )
                          }
                          className="text-gray-400 hover:text-white ml-4"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {isEditing === "scopeAndImplementation" && (
                      <div className="space-y-3">
                        <Textarea
                          value={editingValue}
                          onChange={(e) => setEditingValue(e.target.value)}
                          className="bg-gray-800 border-gray-700 text-white min-h-[300px]"
                        />
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveEdit("scopeAndImplementation")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelEdit}
                            className="border-gray-600 text-gray-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="participants" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Project participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      {planData.sections.governance ||
                        "Project participants details will be generated based on your PDF data."}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="partners" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Partner Organisation(s)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 italic">
                      {planData.sections.partnerOrg || "TBD"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="budget" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Project budget and Schedule of payments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="text-center p-4 bg-gray-800/50 rounded-lg">
                      <p className="text-3xl text-white mb-2">
                        $
                        {planData.sections.budget?.totalFunding?.toLocaleString() ||
                          "450,000"}
                      </p>
                      <p className="text-gray-400">Total Project Funding</p>
                    </div>

                    <div className="space-y-4">
                      {planData.sections.budget?.breakdown?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                          >
                            <div>
                              <p className="text-white">{item.category}</p>
                              <p className="text-gray-400 text-sm">
                                {item.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-white">
                                ${item.amount.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="milestones" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Milestones and Outcomes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {planData.sections.milestones?.map(
                      (milestone: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          className="p-4 bg-gray-800/50 rounded-lg border-l-4 border-l-green-500"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-white">{milestone.phase}</h4>
                            <div className="text-right text-sm text-gray-400">
                              <p>
                                {milestone.startDate} - {milestone.endDate}
                              </p>
                            </div>
                          </div>

                          <p className="text-gray-300 mb-2">
                            {milestone.outcome}
                          </p>

                          <div className="text-sm">
                            <span className="text-green-400">
                              Success Measure:
                            </span>
                            <p className="text-gray-300">{milestone.measure}</p>
                          </div>
                        </motion.div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reporting" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Reporting</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white text-lg mb-3">Narrative</h3>
                      <p className="text-gray-300 italic">
                        {planData.sections.reporting?.narrative || "TBD"}
                      </p>
                    </div>

                    {planData.sections.reporting?.table &&
                      planData.sections.reporting.table.length > 0 && (
                        <div>
                          <h3 className="text-white text-lg mb-3">
                            Deliverables
                          </h3>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse border border-gray-600">
                              <thead>
                                <tr className="bg-gray-800">
                                  <th className="border border-gray-600 px-4 py-2 text-left text-white">
                                    Deliverable
                                  </th>
                                  <th className="border border-gray-600 px-4 py-2 text-left text-white">
                                    Description
                                  </th>
                                  <th className="border border-gray-600 px-4 py-2 text-left text-white">
                                    Due Date
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {planData.sections.reporting.table.map(
                                  (item: any, index: number) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-gray-800/50"
                                    >
                                      <td className="border border-gray-600 px-4 py-2 text-gray-300">
                                        {item.deliverable}
                                      </td>
                                      <td className="border border-gray-600 px-4 py-2 text-gray-300">
                                        {item.description}
                                      </td>
                                      <td className="border border-gray-600 px-4 py-2 text-gray-300">
                                        {item.dueDate}
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evaluation" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Project evaluation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {planData.sections.evaluation?.table &&
                    planData.sections.evaluation.table.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-600">
                          <thead>
                            <tr className="bg-gray-800">
                              <th className="border border-gray-600 px-4 py-2 text-left text-white">
                                Outcome/Result
                              </th>
                              <th className="border border-gray-600 px-4 py-2 text-left text-white">
                                Measure of Success
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {planData.sections.evaluation.table.map(
                              (item: any, index: number) => (
                                <tr
                                  key={index}
                                  className="hover:bg-gray-800/50"
                                >
                                  <td className="border border-gray-600 px-4 py-2 text-gray-300">
                                    {item.outcome}
                                  </td>
                                  <td className="border border-gray-600 px-4 py-2 text-gray-300">
                                    {item.measure}
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-300 italic">TBD</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="risks" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">
                    Risk management plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="assumptions" className="space-y-4">
                    <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                      <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
                      <TabsTrigger value="constraints">Constraints</TabsTrigger>
                      <TabsTrigger value="technical">Technical</TabsTrigger>
                      <TabsTrigger value="external">External</TabsTrigger>
                    </TabsList>

                    <TabsContent value="assumptions" className="space-y-4">
                      {planData.sections.riskManagement?.assumptions?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-800/50 rounded-lg"
                          >
                            <p className="text-white mb-2">{item.assumption}</p>
                            <div className="text-sm">
                              <span className="text-blue-400">Mitigation:</span>
                              <p className="text-gray-300">{item.mitigation}</p>
                            </div>
                          </div>
                        )
                      )}
                    </TabsContent>

                    <TabsContent value="constraints" className="space-y-4">
                      {planData.sections.riskManagement?.constraints?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-800/50 rounded-lg"
                          >
                            <p className="text-white mb-2">{item.constraint}</p>
                            <div className="text-sm">
                              <span className="text-yellow-400">
                                Mitigation:
                              </span>
                              <p className="text-gray-300">{item.mitigation}</p>
                            </div>
                          </div>
                        )
                      )}
                    </TabsContent>

                    <TabsContent value="technical" className="space-y-4">
                      {planData.sections.riskManagement?.technical?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-800/50 rounded-lg"
                          >
                            <p className="text-white mb-2">{item.risk}</p>
                            <div className="text-sm">
                              <span className="text-red-400">Mitigation:</span>
                              <p className="text-gray-300">{item.mitigation}</p>
                            </div>
                          </div>
                        )
                      )}
                    </TabsContent>

                    <TabsContent value="external" className="space-y-4">
                      {planData.sections.riskManagement?.external?.map(
                        (item: any, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-800/50 rounded-lg"
                          >
                            <p className="text-white mb-2">{item.dependency}</p>
                            <div className="text-sm">
                              <span className="text-purple-400">
                                Mitigation:
                              </span>
                              <p className="text-gray-300">{item.mitigation}</p>
                            </div>
                          </div>
                        )
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certification" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Certification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-300 leading-relaxed">
                      By submitting this Project Management Plan, the authorised
                      representative certifies the information is accurate and
                      complete, and that all relevant funding conditions and
                      legislation have been met.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="compliance" className="space-y-6">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white">Compliance Check</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-6 bg-gray-800/50 rounded-lg">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <p className="text-3xl text-white mb-2">
                      {complianceCheck.score}%
                    </p>
                    <p className="text-gray-400">Compliance Score</p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-white">Issues & Recommendations</h4>

                    {complianceCheck.issues.map((issue, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border-l-4 ${
                          issue.type === "warning"
                            ? "bg-yellow-500/10 border-l-yellow-500"
                            : "bg-blue-500/10 border-l-blue-500"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {issue.type === "warning" ? (
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                          ) : (
                            <Lightbulb className="w-4 h-4 text-blue-400" />
                          )}
                          <span className="text-white text-sm">
                            {issue.message}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white">AI Recommendations</h4>
                    {complianceCheck.recommendations.map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg"
                      >
                        <Lightbulb className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </motion.div>
  );
}
