from dotenv import load_dotenv
import os

print("Current directory:", os.getcwd())
print(".env exists:", os.path.exists(".env"))

load_dotenv()
a = os.getenv("API_KEY")
print("API_KEY:", a)