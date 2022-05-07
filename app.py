import sys
import time
import hashlib
import uuid

from flask import Flask, jsonify, make_response, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

app = Flask(__name__)
CORS(app, support_credentials=True)
api = Api(app)

# Use a service account
cred = credentials.Certificate('credentials/gcp.json')
firebase_admin.initialize_app(cred)

db = firestore.client()


class CreateJournalEntry(Resource):
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('tags')
        parser.add_argument('situation')
        parser.add_argument('task')
        parser.add_argument('action')
        parser.add_argument('result')
        parser.add_argument('user_id')
        args = parser.parse_args()

        if 'user_id' not in args:
            response = make_response(jsonify({'errorcode': 'not-signed-in'}), 401)
            return response

        doc_ref = db.collection(u'journal_entries').document()
        doc_ref.set({
            u'user_id': args['user_id'],
            u'tags': args['tags'].split(','),
            u'situation': args['situation'],
            u'task': args['task'],
            u'action': args['action'],
            u'result': args['result'],
            u'createdAt': int(time.time()),
        })

        # Get created object
        doc = doc_ref.get()

        res_data = {'journal_entry': doc.to_dict()}
        return res_data


api.add_resource(CreateJournalEntry, '/journal-entries')


class GetJournalEntries(Resource):
    @staticmethod
    def post():
        print("here")
        parser = reqparse.RequestParser()
        parser.add_argument('user_id')
        args = parser.parse_args()

        if 'user_id' not in args:
            response = make_response(jsonify({'errorcode': 'not-signed-in'}), 401)
            return response

        entries = db.collection(u'journal_entries').where(u'user_id', u'==', args["user_id"]).stream()

        response_entries = []

        for entry_doc in entries:
            entry = entry_doc.to_dict()
            response_entries.append(entry)

        return {'journal_entries': response_entries}


api.add_resource(GetJournalEntries, '/get-journal-entries')


class UserAccounts(Resource):

    # We'll use the same endpoint/method for both registering and signing in.
    # When a request is received, first check if an account with that email already exists.
    # If it DOES, check the password.
    # If it DOES NOT, register a new account.
    # This makes the frontend UX simpler.
    @staticmethod
    def post():
        parser = reqparse.RequestParser()
        parser.add_argument('email')
        parser.add_argument('password')
        args = parser.parse_args()

        hash_obj = hashlib.md5(args['password'].encode('utf-8'))

        doc_ref = db.collection(u'accounts').document(args['email'])
        doc = doc_ref.get().to_dict()

        if doc is None:
            # Account does not exist yet
            doc_ref.set({
                u'email': args['email'],
                u'pwd_hash': hash_obj.hexdigest(),
                u'user_id': str(uuid.uuid4()),
                u'createdAt': int(time.time())
            })

            # Get created object
            doc = doc_ref.get().to_dict()
            response = make_response(jsonify({'user_id': doc["user_id"]}), 200)
            return response
        else:
            # Account already exists
            if doc["pwd_hash"] != hash_obj.hexdigest():
                response = make_response(jsonify({'user_id': None}), 401)
                return response

            response = make_response(jsonify({'user_id': doc["user_id"]}), 200)
            return response


api.add_resource(UserAccounts, '/accounts')

if __name__ == '__main__':
    app.run(debug=True)
