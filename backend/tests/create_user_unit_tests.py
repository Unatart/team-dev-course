import unittest
from unittest.mock import MagicMock

import peewee

from app import APP as app
from database_wrapper import Repository as repository
from tests.utils import *


class CreateUserTests(unittest.TestCase):

    def setUp(self):
        self.repository_create_user = repository.create_user
        self.repository_login = repository.login

    def tearDown(self):
        repository.create_user = self.repository_create_user
        repository.login = self.repository_login

    def test_create_user_valid(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])
            rv = create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            json_data = rv.get_json()
            assert rv._status_code == 201

    def test_create_user_existing_email(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])
            rv = create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            assert rv._status_code == 201
            repository.create_user = MagicMock(side_effect=peewee.IntegrityError)
            rv = create_user(c, CORRECT_USERNAME_2, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            assert rv._status_code == 400

    def test_create_user_existing_username(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])
            rv = create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            assert rv._status_code == 201
            repository.create_user = MagicMock(side_effect=peewee.IntegrityError)
            rv = create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_2, CORRECT_PASSWORD_1)
            assert rv._status_code == 400

    def test_create_user_missing_username(self):
        with app.test_client() as c:
            req_json = {
                'email': CORRECT_EMAIL_1,
                'password': CORRECT_PASSWORD_1
            }
            repository.create_user = MagicMock(side_effect=KeyError)
            rv = c.post('/api/users', json=req_json)
            assert rv._status_code == 400

    def test_create_user_missing_email(self):
        with app.test_client() as c:
            req_json = {
                'username': CORRECT_USERNAME_1,
                'password': CORRECT_PASSWORD_1
            }
            repository.create_user = MagicMock(side_effect=KeyError)
            rv = c.post('/api/users', json=req_json)
            assert rv._status_code == 400

    def test_create_user_missing_password(self):
        with app.test_client() as c:
            req_json = {
                'username': CORRECT_USERNAME_1,
                'email': CORRECT_EMAIL_1
            }
            repository.create_user = MagicMock(side_effect=KeyError)
            rv = c.post('/api/users', json=req_json)
            assert rv._status_code == 400

    def test_create_user_incorrect_username_long(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(side_effect=ValueError)
            rv = create_user(c, INCORRECT_USERNAME_LONG, CORRECT_EMAIL_2, CORRECT_PASSWORD_1)
            assert rv._status_code == 400

    def test_create_user_incorrect_username_short(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(side_effect=ValueError)
            rv = create_user(c, INCORRECT_USERNAME_SHORT, CORRECT_EMAIL_2, CORRECT_PASSWORD_1)
            assert rv._status_code == 400

    def test_create_user_incorrect_username_restricted_characters(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(side_effect=ValueError)
            rv = create_user(c, INCORRECT_USERNAME_RESTRICTED_CHARACTERS, CORRECT_EMAIL_2, CORRECT_PASSWORD_1)
            assert rv._status_code == 400
