from dotenv import load_dotenv
import os
load_dotenv()
a=os.getenv("API_KEY")
print(a)