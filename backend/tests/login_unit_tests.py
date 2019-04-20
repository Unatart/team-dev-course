import unittest
from unittest.mock import MagicMock

from app import APP as app
from database_models import User
from database_wrapper import Repository as repository
from tests.utils import *


class LoginTests(unittest.TestCase):

    def setUp(self):
        self.repository_create_user = repository.create_user
        self.repository_login = repository.login

    def tearDown(self):
        repository.create_user = self.repository_create_user
        repository.login = self.repository_login

    def test_login_correct_username(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                        "email": CORRECT_EMAIL_1}, 200])

            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, CORRECT_USERNAME_1, None, CORRECT_PASSWORD_1)

            json_data = rv.get_json()
            assert rv._status_code == 200
            assert json_data['email'] == CORRECT_EMAIL_1
            assert json_data['username'] == CORRECT_USERNAME_1

    def test_login_correct_email(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                        "email": CORRECT_EMAIL_1}, 200])

            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, None, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)

            json_data = rv.get_json()
            assert rv._status_code == 200
            assert json_data['email'] == CORRECT_EMAIL_1
            assert json_data['username'] == CORRECT_USERNAME_1

    def test_login_incorrect_username(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(side_effect=User.DoesNotExist)

            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, CORRECT_USERNAME_2, None, CORRECT_PASSWORD_1)

            assert rv._status_code == 404

    def test_login_incorrect_email(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(side_effect=User.DoesNotExist)
            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, None, CORRECT_EMAIL_2, CORRECT_PASSWORD_1)

            assert rv._status_code == 404

    def test_login_incorrect_password(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(return_value=[{}, 403])
            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, None, CORRECT_EMAIL_1, CORRECT_PASSWORD_2)

            assert rv._status_code == 403

    def test_login_missing_username_and_email(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(side_effect=KeyError)
            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, None, None, CORRECT_PASSWORD_1)

            assert rv._status_code == 400

    def test_login_missing_password(self):
        with app.test_client() as c:
            repository.create_user = MagicMock(return_value=[{"username": CORRECT_USERNAME_1,
                                                              "email": CORRECT_EMAIL_1}])

            repository.login = MagicMock(side_effect=KeyError)

            create_user(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, CORRECT_PASSWORD_1)
            rv = login(c, CORRECT_USERNAME_1, CORRECT_EMAIL_1, None)

            assert rv._status_code == 400
