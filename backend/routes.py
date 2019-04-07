import json
import peewee
from flask import request, abort, make_response, jsonify, Blueprint

from database_models import User
from database_wrapper import Repository
from appconfig import DB


REPOSITORY = Repository(DB)
ECONOMICS_APP = Blueprint('app', __name__)


@ECONOMICS_APP.route('/api/users', methods=['POST'])
def create_user():
    try:
        req_user = json.loads(request.data)
        resp_user = REPOSITORY.create_user(req_user)
        return make_response(jsonify(resp_user), 201)
    except peewee.IntegrityError:
        abort(400)
    except ValueError:
        abort(400)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/login', methods=['POST'])
def login():
    try:
        req_user = json.loads(request.data)
        resp_user, status_code = REPOSITORY.login(req_user)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp_user), 200)
    except KeyError:
        abort(400)
    except User.DoesNotExist:
        abort(404)


@ECONOMICS_APP.route('/api/arrivals', methods=['POST'])
def add_arrival():
    req = json.loads(request.data)
    resp, _ = REPOSITORY.add_arrival(req)
    return make_response(jsonify(resp), 201)


@ECONOMICS_APP.route('/api/arrivals/<arrival_id>', methods=['POST'])
def update_arrival(arrival_id):
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.update_arrival(req, arrival_id)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/arrivals/<arrival_id>', methods=['DELETE'])
def delete_arrival(arrival_id):
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.delete_arrival(req, arrival_id)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)

    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/categories', methods=['POST'])
def add_category():
    try:
        req = json.loads(request.data)
        resp, _ = REPOSITORY.add_category(req)
        return make_response(jsonify(resp), 201)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/spendings', methods=['POST'])
def add_spending():
    try:
        req = json.loads(request.data)
        resp, _ = REPOSITORY.add_spending(req)
        return make_response(jsonify(resp), 201)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/spendings/<spending_id>', methods=['POST'])
def update_spending(spending_id):
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.update_spending(req, spending_id)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/spendings/<spending_id>', methods=['DELETE'])
def delete_spending(spending_id):
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.delete_spending(req, spending_id)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/users/<string:username>', methods=['GET'])
def get_user_tables(username):
    try:
        resp, status_code = REPOSITORY.get_user_tables(username)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)
