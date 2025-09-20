import os
import sys
import json
import re
import google.generativeai as genai
from dotenv import load_dotenv


def _extract_json(text: str) -> dict:
    """
    Try to parse JSON from the LLM response. The model may wrap JSON in
    code fences or include prose. We extract the first top-level JSON object.
    """
    if not text:
        raise ValueError("Empty response from model")

    # Fast path: direct JSON
    try:
        return json.loads(text)
    except Exception:
        pass

    # Strip code fences if present
    fenced = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
    if fenced:
        candidate = fenced.group(1).strip()
        try:
            return json.loads(candidate)
        except Exception:
            pass

    # Fallback: find first {...} block
    start = text.find("{")
    end = text.rfind("}")
    if start != -1 and end != -1 and end > start:
        candidate = text[start : end + 1]
        try:
            return json.loads(candidate)
        except Exception:
            pass

    raise ValueError("Failed to parse JSON from model response")


def main():
    try:
        data = json.load(sys.stdin)
    except Exception as e:
        print(json.dumps({"ok": False, "error": f"Invalid JSON input: {e}"}))
        sys.exit(1)

    startup_name = data.get("startupName", "").strip()
    action_test = data.get("actionTest", "").strip()
    context = data.get("context", "").strip()
    target_audience = data.get("targetAudience", "").strip()

    if not (startup_name and action_test and context and target_audience):
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": "Missing required fields: startupName, actionTest, context, targetAudience",
                }
            )
        )
        sys.exit(1)

    # Load .env if present
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print(json.dumps({"ok": False, "error": "GEMINI_API_KEY not set"}))
        sys.exit(1)

    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash-latest")

    prompt = f"""
You are a virtual startup simulator. Analyze the scenario below and return STRICT JSON only.

Startup Name: {startup_name}
Action/Test: {action_test}
Context: {context}
Target Audience: {target_audience}

Return ONLY a compact JSON object with these exact keys:
- executive_summary: string (3-6 sentences)
- positive_outcomes: string[] (5-7 concise bullets)
- potential_risks: string[] (5-7 concise bullets)
- recommendations: string[] (5-7 actionable bullets)

Example format (do not include comments):
{{
  "executive_summary": "...",
  "positive_outcomes": ["..."],
  "potential_risks": ["..."],
  "recommendations": ["..."]
}}
"""

    try:
        resp = model.generate_content(prompt)
        raw_text = resp.text if hasattr(resp, "text") else str(resp)
        parsed = _extract_json(raw_text)
        result = {
            "ok": True,
            "executive_summary": parsed.get("executive_summary")
            or parsed.get("summary")
            or parsed.get("scenario_summary")
            or "",
            "positive_outcomes": parsed.get("positive_outcomes") or [],
            "potential_risks": parsed.get("potential_risks") or [],
            "recommendations": parsed.get("recommendations") or [],
        }
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"ok": False, "error": f"Model error: {e}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()


