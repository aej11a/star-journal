import sys
from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)
api = Api(app)


class HelloWorld(Resource):
    def get(self):
        return {'hello': {'little': 'one!'}}


api.add_resource(HelloWorld, '/')

if __name__ == '__main__':
    print(sys.argv[1])
    app.run(debug=True)
