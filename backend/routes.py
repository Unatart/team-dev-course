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
        return make_response(jsonify(resp_user))
    except KeyError:
        abort(400)
    except User.DoesNotExist:
        abort(404)
