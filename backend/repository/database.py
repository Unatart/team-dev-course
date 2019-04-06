from passlib.hash import pbkdf2_sha256
from models.database import User
from validator.validator import Validator


def generate_password_hash(password):
    return pbkdf2_sha256.encrypt(password, rounds=200000, salt_size=16)


class Repository:
    def __init__(self, database):
        self.database = database

    def create_user(self, user):
        with self.database.atomic():
            if user is None or not 'email' in user or not 'username' in user \
                    or not 'password' in user or not Validator.validate_password(user['password']) \
                    or not Validator.validate_email(user['email']) \
                    or not Validator.validate_username(user['username']):
                raise ValueError

            user['password'] = generate_password_hash(user['password'])

            new_user = User(**user)
            new_user.save()
            return {"username": new_user.username, "email": new_user.email}

    def login(self, user):
        with self.database.atomic():
            if 'email' in user:
                db_user = User.get(User.email == user['email'])
            else:
                db_user = User.get(User.username == user['username'])
            if not pbkdf2_sha256.verify(user['password'], db_user.password):
                return {}, 403
            return {'username': db_user.username, 'email': db_user.email}, 200
