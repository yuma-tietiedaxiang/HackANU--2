import gradio as gr
import google.generativeai as genai

# --- Function to configure API and run the simulator ---
def simulate_startup(api_key, startup_name, action_or_test, context, audience):
    """
    Simulate what will happen if a certain action/test is done for a startup.
    """
    # Configure the API with your key
    genai.configure(api_key='AIzaSyAq0w7vITAwbVMy4c3aCfv7p0naJ6IFWOw')
    
    model = genai.GenerativeModel('gemini-1.5-flash-latest')
    
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

    response = model.generate_content(prompt)
    return response.text

# --- Gradio UI ---
with gr.Blocks() as demo:
    gr.Markdown("<h1 style='text-align:center;color:white;'>🚀 Startup Simulator</h1>", elem_classes="header")
    
    with gr.Row():
        api_key = gr.Textbox(label="API Key", placeholder="Enter your Gemini API Key", type="password")
    
    with gr.Row():
        startup_name = gr.Textbox(label="Startup Name", placeholder="Enter your startup name")
        action_or_test = gr.Textbox(label="Action/Test", placeholder="What action or test to simulate?")
    
    context = gr.Textbox(label="Startup Context", placeholder="Describe your startup or product")
    audience = gr.Textbox(label="Target Audience", placeholder="Who is affected or targeted?")
    
    output = gr.Textbox(label="Simulation Output", placeholder="Scenario will appear here...", lines=20)
    
    simulate_btn = gr.Button("Run Simulation")
    simulate_btn.click(
        simulate_startup, 
        inputs=[api_key, startup_name, action_or_test, context, audience], 
        outputs=output
    )

# --- Apply dark theme ---
demo.launch(css="""
    body {background-color: #000; color: #fff;}
    .header {color: #fff;}
    .gr-button {background-color: #fff; color: #000; border: 2px solid #fff;}
    .gr-button:hover {background-color: #000; color: #fff; border: 2px solid #fff;}
    .gr-textbox textarea {background-color: #111; color: #fff; border: 1px solid #fff;}
    .gr-label {color: #fff;}
""")
