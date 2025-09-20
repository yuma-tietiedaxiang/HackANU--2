import os
from flask import Flask, render_template, request
import google.generativeai as genai
from dotenv import load_dotenv

# --- Load API key from .env ---
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment. Please set it in .env")

# Configure Google Gemini AI
genai.configure(api_key=api_key)

# --- Flask App Setup ---
app = Flask(__name__)

# --- Function to generate startup simulation ---
def generate_startup_simulation(startup_name, action_or_test, context, audience):
    model = genai.GenerativeModel("gemini-1.5-flash-latest")

    prompt = f"""
    You are a virtual startup simulator. Your task is to predict and describe
    what will happen if a specific action or test is performed by a startup.

    Startup Name: {startup_name}
    Action/Test: {action_or_test}
    Context: {context}
    Target Audience: {audience}

    Instructions:
    1. Describe the likely outcomes and results of this action or test.
    2. Include potential positive and negative consequences.
    3. Provide actionable insights and recommendations.
    4. Format the output with clear headings:
       - Scenario Summary
       - Positive Outcomes
       - Potential Risks
       - Recommendations

    Scenario Summary:
    Positive Outcomes:
    Potential Risks:
    Recommendations:
    """

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Error generating content: {str(e)}"

# --- Routes ---
@app.route("/", methods=["GET", "POST"])
def home():
    output = ""
    if request.method == "POST":
        startup_name = request.form.get("startup_name", "")
        action_or_test = request.form.get("action_or_test", "")
        context = request.form.get("context", "")
        audience = request.form.get("audience", "")
        output = generate_startup_simulation(startup_name, action_or_test, context, audience)
    return render_template("index.html", output=output)

# --- Run App ---
if __name__ == "__main__":
    app.run(debug=True)
