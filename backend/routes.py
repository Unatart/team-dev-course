""" @package routes
Application routes
Arguments:
    REPOSITORY (Repository): db wrapper
    ECONOMICS_APP (flask.Blueprint): app blueprint
"""
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
    """ Get request data and call wrapper func for user creation
    Args:
        request
    Returns:
        response, 201 if wrapper returns 201

        400 otherwise
    """
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
    """ Get request data and call wrapper func for login
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403

        400 if KeyError

        404 if peewee: User.DoesNotExist
    """
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
    """ Get request and call wrapper func for arrival creation
    Args:
        request
    Returns:
        response, 201
    """
    req = json.loads(request.data)
    resp, _ = REPOSITORY.add_arrival(req)
    return make_response(jsonify(resp), 201)


@ECONOMICS_APP.route('/api/arrivals/<arrival_id>', methods=['POST'])
def update_arrival(arrival_id):
    """ Get request data and arrival id, call wrapper func for update arrival
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
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
    """ Get request data and arrival id, call wrapper func for delete arrival
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
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
    """ Get request data and call wrapper func for category creation
    Args:
        request
    Returns:
        response, 201 if wrapper returns 201

        400 if KeyError
    """
    try:
        req = json.loads(request.data)
        resp, _ = REPOSITORY.add_category(req)
        return make_response(jsonify(resp), 201)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/spendings', methods=['POST'])
def add_spending():
    """ Get request data and call wrapper func for spending creation
    Args:
        request
    Returns:
        response, 201 if wrapper returns 201

        400 if KeyError
    """
    try:
        req = json.loads(request.data)
        resp, _ = REPOSITORY.add_spending(req)
        return make_response(jsonify(resp), 201)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/spendings/<spending_id>', methods=['POST'])
def update_spending(spending_id):
    """ Get request data, spending id and call wrapper func for update spending
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
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
    """ Get request data, spending id and call wrapper func for delete spending
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.delete_spending(req, spending_id)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/users/<username>', methods=['GET'])
def get_user_tables(username):
    """ Get username and call wrapper func for get user info
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
    try:
        resp, status_code = REPOSITORY.get_user_tables(username)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)


@ECONOMICS_APP.route('/api/chart', methods=['POST'])
def get_chart_info():
    """ Get request data and call wrapper func for get chart info
    Args:
        request
    Returns:
        response, 200 if wrapper returns 200

        403 if wrapper returns 403 (user doesn't have permission)

        400 if KeyError
    """
    try:
        req = json.loads(request.data)
        resp, status_code = REPOSITORY.get_chart_info(req)
        if status_code == 403:
            abort(403)
        return make_response(jsonify(resp), 200)
    except KeyError:
        abort(400)

