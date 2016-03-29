# We need to import request to access the details of the POST request
# and render_template, to render our templates (form and response)
# we'll use url_for to get some URLs for the app on the templates
from flask import Flask, request, jsonify
from pymongo import MongoClient
import os
import json
from bson import json_util

# Initialize the Flask application
app = Flask(__name__)

port = int(os.getenv("PORT"))

mongoService = json.loads(os.environ['VCAP_SERVICES'])['Mongodb Service'][0]
mongoCreds = mongoService['credentials']

if mongoCreds:
    mongoDB = mongoCreds['database']
    mongoHost = mongoCreds['host']
    mongoPassword = mongoCreds['password']
    mongoPort = int(mongoCreds['port'])
    mongoUsername = mongoCreds['username']
    mongoURL = str(mongoCreds['uri'])

client = MongoClient(mongoHost, mongoPort)
db = client[mongoDB]
posts = db.posts

# Define a route for the default URL, which loads the form
@app.route('/hello/', methods=['GET'])
def form():
    arrayList = []
    for post in posts.find():
        print "post ",post
        result = post
        d = json.dumps(result, default=json_util.default)
        arrayList.append(d)
        print arrayList
    #    return jsonify(result = arrayList)
    return jsonify(result = arrayList)
#    return "GET RECEIVED""

# Define a route for the action of the form, for example '/hello/'
# We are also defining which type of requests this route is
# accepting: POST requests in this case
@app.route('/hello/', methods=['POST'])
def hello():
    jsonObj = request.json
    post_id = posts.insert_one(jsonObj).inserted_id
    print post_id
    if post_id:
        return "Success"
    else:
        return "failed"


# Run the app :)
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port)
