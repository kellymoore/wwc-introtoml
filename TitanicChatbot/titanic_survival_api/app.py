from flask import Flask, request
import numpy as np
import pickle
import json

app = Flask(__name__)

def titanicModel():
    dt_filename = 'dt_titanic_model.pkl'
    dt_model_file = open(dt_filename, 'rb')
    dt_model = pickle.load(dt_model_file)
    print "Loaded Decision tree model :: ", dt_model

    return dt_model

@app.route("/predict", methods=["POST"])
def predict():
    data = json.loads(request.data)

    prediction_data = [data['pclass'], data['sex'], data['age'], data['sibsp'], data['parch'], data['fare'], data['embarked']]

    prediction = model.predict(np.array([prediction_data]))

    result = {'survive': prediction.item(0)}
    return json.dumps(result)

if __name__ == '__main__':
    print 'initalizing model ...'
    model = titanicModel()

    app.run(debug=True)


