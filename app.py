from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
from dotenv import load_dotenv
import os
import json

# Load env
load_dotenv()

app = Flask(__name__)
CORS(app)

# Initialize LLM
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    api_key=os.getenv("API_KEY"),
    temperature=0.5
)


@app.route("/form_generation", methods=["POST"])
def form_generation():
    try:
        data = request.json

        role = data.get("role")
        experience = data.get("experience")
        sections = data.get("sections")

        feedback_sections = {}

        # 🔥 Generate questions per section
        for section in sections:
            prompt = f"""
            Generate 5 role-specific performance evaluation questions.

            Role: {role}
            Experience: {experience}
            Section: {section}

            Return ONLY a JSON array like:
            ["question1", "question2", "question3", "question4", "question5"]
            """

            response = llm.invoke(prompt)
            output_text = response.content

            # Extract JSON list safely
            start = output_text.find("[")
            end = output_text.rfind("]") + 1

            if start == -1 or end == -1:
                questions = ["Unable to generate questions"]
            else:
                try:
                    questions = json.loads(output_text[start:end])
                except:
                    questions = ["Error parsing questions"]

            # Format into required structure
            formatted_questions = [
                {f"question_{i+1}": q} for i, q in enumerate(questions[:5])
            ]

            feedback_sections[section] = {
                "questions": formatted_questions
            }

        # 🔥 Final structured output
        final_output = {
            "employee_information": {
                "role": role,
                "experience": experience
            },
            "feedback_sections": feedback_sections,
            "open_ended_feedback": {
                "areas_for_improvement": f"What areas should a {role} improve?",
                "strengths": f"What are the key strengths of this {role}?",
                "suggestions_for_growth": f"What growth suggestions would you give for {experience} experience?"
            }
        }

        return jsonify(final_output)

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
