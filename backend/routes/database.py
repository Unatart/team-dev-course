import json
import peewee
from flask import request, abort, make_response, jsonify

from models.database import User
from repository.database import Repository
from appconfig import APP, DB


REPOSITORY = Repository(DB)


@APP.route('/api/users', methods=['POST'])
def create_user():
    try:
        req_user = json.loads(request.data)
        resp_user = REPOSITORY.create_user(req_user)
        resp = make_response(jsonify(resp_user), 201)
        return resp
    except peewee.IntegrityError:
        abort(400)
    except ValueError:
        abort(400)
    except KeyError:
        abort(400)


@APP.route('/api/login', methods=['POST'])
def login():
    try:
        req_user = json.loads(request.data)
        resp_user, status_code = REPOSITORY.login(req_user)
        if status_code == 403:
            abort(403)

        return make_response(jsonify(resp_user))
    except KeyError:
        abort(400)
    except User.DoesNotExist:
        abort(404)
