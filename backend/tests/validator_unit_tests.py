import unittest

from tests.utils import *
from validator import Validator


class ValidatorTests(unittest.TestCase):

    def test_validate_password_correct(self):
        assert Validator.validate_password(CORRECT_PASSWORD_1) is True

    def test_validate_password_long(self):
        assert Validator.validate_password(INCORRECT_PASSWORD_LONG) is False

    def test_validate_password_short(self):
        assert Validator.validate_password(INCORRECT_PASSWORD_SHORT) is False

    def test_validate_username_correct(self):
        assert Validator.validate_password(CORRECT_USERNAME_1) is True

    def test_validate_username_long(self):
        assert Validator.validate_username(INCORRECT_USERNAME_LONG) is False

    def test_validate_username_short(self):
        assert Validator.validate_username(INCORRECT_USERNAME_SHORT) is False

    def test_validate_username_restricted_characters(self):
        assert Validator.validate_username(INCORRECT_USERNAME_RESTRICTED_CHARACTERS) is False

    def test_validate_email_correct(self):
        assert Validator.validate_email(CORRECT_EMAIL_1) is True

    def test_validate_email_restricted_characters(self):
        assert Validator.validate_email(INCORRECT_EMAIL_RESTRICTED_CHARACTERS) is False

    def test_validate_email_no_at(self):
        assert Validator.validate_email(INCORRECT_EMAIL_NO_AT) is False
