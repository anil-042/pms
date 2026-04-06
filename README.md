# 🚀 AI-Based Performance Management System

## 📌 Overview

This project is an **AI-powered Performance Management System** that automatically generates structured 360-degree feedback forms based on employee role, experience, and evaluation sections.

It uses **Flask (backend)** and **LangChain with LLM (Groq - LLaMA model)** to generate intelligent and structured responses.

---

## 🎯 Features

* Generate **role-based feedback forms**
* AI-powered question generation
* Structured JSON output
* REST API using Flask
* Easy integration with frontend (React)

---

## 🛠️ Tech Stack

* Python
* Flask
* LangChain
* Groq API (LLaMA model)
* dotenv (for environment variables)

---

## 📂 Project Structure

```
pms-main/
│── app.py          # Main Flask app
│── api.py          # API and AI logic
│── .env            # API keys (not pushed to GitHub)
│── requirements.txt
│── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone the repository

```
git clone <your-repo-link>
cd pms-main
```

---

### 2️⃣ Create virtual environment

```
python -m venv venv
venv\Scripts\activate
```

---

### 3️⃣ Install dependencies

```
pip install langchain==0.0.350
pip install langchain-groq==0.0.1
pip install flask python-dotenv flask-cors
```

---

### 4️⃣ Setup environment variables

Create a `.env` file and add:

```
API_KEY=your_groq_api_key_here
```

---

### 5️⃣ Run the application

```
python app.py
```

---

## 🔌 API Endpoint

### ➤ Generate Feedback Form

**POST** `/form_generation`

#### Request Body:

```
{
  "role": "Software Engineer",
  "experience": "2 years",
  "sections": ["team_collaboration", "performance"]
}
```

#### Response:

```
{
  "employee_information": {
    "role": "Software Engineer",
    "experience": "2 years"
  },
  "feedback_sections": {
    ...
  }
}
```

---

## 💡 How It Works

1. User sends input via API
2. Flask receives request
3. LangChain processes prompt
4. LLM generates structured feedback
5. JSON response is returned

---

## 🚧 Challenges Faced

* Handling **strict JSON output from LLM**
* Managing **LangChain dependency conflicts**
* Ensuring **API key security**

---

## 🔮 Future Improvements

* Add React frontend UI
* Store data in database
* Deploy on Azure
* Add authentication system

---

## 👨‍💻 Author

Anil Kumar

---

## ⭐ Contribution

Feel free to fork and contribute to this project!
