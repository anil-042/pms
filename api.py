from flask import Flask,request,jsonify

app = Flask(__name__)

@app.route("/add",methods =["POST"])
def hello():
    data= request.json
    a = data["num1"]
    b = data["num2"]

    return jsonify({"sum":a+b}) 

        
if __name__=="__main__":
    app.run(debug=True)