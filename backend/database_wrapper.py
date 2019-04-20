""" @package database_wrapper
Wrapper of app database
"""

from passlib.hash import pbkdf2_sha256
from database_models import User, Arrival, Category, Spending
from validator import Validator


def generate_password_hash(password):
    """ Generates hash for password to store it in db
    Args:
        password (str): password
    Returns:
        SHA256 hash of password
    """
    return pbkdf2_sha256.encrypt(password, rounds=200000, salt_size=16)


class Repository:
    """DB wrapper class
    """
    def __init__(self, database):
        """ __init__ method
        Args:
            database (peewee.PostgresqlDatabase): given database object
        """
        self.database = database

    def create_user(self, user):
        """ Creates user with given parameters
        Args:
            user (dict(username, email, password)): dict with user info
        Returns:
            if user data is valid: {
                'username': str,
                'email', str,
            }, 201
        Raises:
            ValueError: if dict lacks one of fields or password fails to validate
        """
        with self.database.atomic():
            if user is None or 'email' not in user or 'username' not in user \
                    or 'password' not in user:
                raise ValueError('Some fields are missing')
            if not Validator.validate_password(user['password']) \
                    or not Validator.validate_email(user['email']) \
                    or not Validator.validate_username(user['username']):
                raise ValueError('Some fields are incorrect')

            user['password'] = generate_password_hash(user['password'])

            new_user = User(**user)
            new_user.save()
            return {"username": new_user.username, "email": new_user.email}, 201

    def login(self, user):
        """ Performs user authentication
        Args:
            user (dict(username | email, password)): dict with user info
        Returns:
            {
                'username': str,
                'email', str,
            }, 200 if user data is valid

            {}, 403 if password is invalid
        """
        with self.database.atomic():
            if 'email' in user:
                db_user = User.get(User.email == user['email'])
            else:
                db_user = User.get(User.username == user['username'])
            if not pbkdf2_sha256.verify(user['password'], db_user.password):
                return {}, 403
            return {'username': db_user.username, 'email': db_user.email}, 200

    def add_arrival(self, req):
        """ Adds arrival to database
        Args:
            req (dict(username, amount, description, date)): dict with arrival info
        Returns:
            {
                'id': int
            }, 201 if arrival info is valid
        """
        with self.database.atomic():
            db_user = User.get(User.username == req['username'])

            amount = req['amount']
            description = req['description']
            date = req['date']

            new_arrival = Arrival(amount=amount, description=description, date=date, user=db_user)
            new_arrival.save()

            return {'id': new_arrival.get_id()}, 201

    def update_arrival(self, req, arrival_id):
        """ Updates arrival data in database
        Args:
            req (dict(username, amount, description, date)): dict with arrival info,
            arrival_id (int): id of arrival to modify
        Returns:
            {
                'id': int,
                'amount': int,
                'description': str,
                'date': str
            }, 200 if arrival info is valid

            {}, 403 if user doesn't have permission to modify arrival with given id

            {}, 404 if arrival with given id does not exist
        """
        with self.database.atomic():
            arrival = Arrival.get_by_id(arrival_id)
            if arrival is not None:
                user = User.get(User.username == req['username'])
                if arrival.user == user:
                    arrival.amount = req['amount']
                    arrival.description = req['description']
                    arrival.date = req['date']
                    arrival.save()
                else:
                    return {}, 403
            else:
                return {}, 404
            return {
                'id': arrival.get_id(), 'amount': arrival.amount, 'description': arrival.description,
                'date': arrival.date
            }, 200

    def delete_arrival(self, req, arrival_id):
        """ Deletes arrival data from database
        Args:
            req (dict(username)): dict with arrival info,
            arrival_id (int): id of arrival to modify
        Returns:
            {}, 200 if arrival info is valid

            {}, 403 if user doesn't have permission to modify arrival with given id

            {}, 404 if arrival with given id does not exist
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])
            arrival = Arrival.get_by_id(arrival_id)
            if arrival is not None:
                if arrival.user == user:
                    arrival.delete_instance()
                else:
                    return {}, 403
            else:
                return {}, 404
            return {}, 200

    def add_category(self, req):
        """ Adds category to database
        Args:
            req (dict(username, description)): dict with category info
        Returns:
            {
                'id': int
            }, 201 if category info is valid
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])
            description = req['description']

            category = Category(description=description, user=user)
            category.save()

            return {'id': category.get_id()}, 201

    def add_spending(self, req):
        """ Adds spending to database
        Args:
            req (dict(username, amount, description, date, category)): dict with spending info
        Returns:
            {
                'id': int
            }, 201 if spending info is valid
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])

            amount = req['amount']
            description = req['description']
            date = req['date']
            category_descr = req['category']
            category = Category.get(Category.user == user and Category.description == category_descr)

            spending = Spending(amount=amount, description=description, date=date, category=category, user=user)
            spending.save()

            return {'id': spending.get_id()}, 201

    def update_spending(self, req, spending_id):
        """ Updates spending data in database
        Args:
            req (dict(username, amount, description, date)): dict with spending info,
            spending_id (int): id of spending to modify
        Returns:
            {
                'id': int,
                'amount': int,
                'description': str,
                'date': str,
                'category': str,
            }, 200 if spending info is valid

            {}, 403 if user doesn't have permission to modify spending with given id

            {}, 404 if spending with given id does not exist
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])

            spending = Spending.get_by_id(spending_id)
            if spending is not None:
                if spending.user == user:
                    spending.amount = req['amount']
                    spending.description = req['description']
                    spending.date = req['date']
                    spending.category = Category.get(Category.user == user and Category.description == req['category'])
                    spending.save()
                else:
                    return {}, 403
            else:
                return {}, 404
            return {
                'id': spending.get_id(), 'amount': spending.amount, 'description': spending.description,
                'date': spending.date, 'category': spending.category.description
            }, 200

    def delete_spending(self, req, spending_id):
        """ Deletes arrival data from database
        Args:
            req (dict(username)): dict with spending info,
            spending_id (int): id of spending to modify
        Returns:
            {}, 200 if spending info is valid

            {}, 403 if user doesn't have permission to modify spending with given id

            {}, 404 if spending with given id does not exist
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])
            spending = Spending.get_by_id(spending_id)
            if spending is not None:
                if spending.user == user:
                    spending.delete_instance()
                else:
                    return {}, 403
            else:
                return {}, 404
            return {}, 200

    def get_user_tables(self, username):
        """ Gives all spending, arrival, category for user
        Args:
            username (str): username of given user

        Returns:
            {
                'arrivalsList': list of {money: int, description: str, date: str, id: int},
                'category': list of {description: str},
                'spendingsList': list of {money: int, description: str, date: str, category: str, id: int}
                'user': str
            }, 200
        """
        with self.database.atomic():
            user = User.get(User.username == username)

            arrivals = [
                {
                    "money": arrival.amount,
                    "description": arrival.description,
                    "date": str(arrival.date),
                    "id": arrival.id
                }
                for arrival in Arrival.select(
                    Arrival.amount, Arrival.description, Arrival.date, Arrival.id
                ).where(Arrival.user == user)
            ]

            categories = [
                {
                    "description": category.description
                }
                for category in Category.select(
                    Category.description, Category.id
                ).where(Category.user == user)
            ]

            spendings = [
                {
                    "money": spending.amount,
                    "description": spending.description,
                    "date": str(spending.date),
                    "category": spending.category.description,
                    "id": spending.id
                }
                for spending in Spending.select(
                    Spending.amount, Spending.description, Spending.date, Spending.category, Spending.id
                ).where(Spending.user == user)
            ]

            return {
                'arrivalsList': arrivals, 'category': categories, 'spendingsList': spendings, 'user': user.username
            }, 200

    def get_chart_info(self, req):
        """ Gives spending data by category for pie chart
        Args:
            req (dict(start_date, finish_date)): dates for spending monitoring

        Returns:
            {
                'info': list of {'category': str, 'money': float}
            }, 200
        """
        with self.database.atomic():
            user = User.get(User.username == req['username'])

            start_date = req['start_date']
            finish_date = req['finish_date']

            categories = [
                category.description
                for category in Category.select(
                    Category.description, Category.id
                ).where(Category.user == user)
            ]

            spendings = [
                {
                    "money": spending.amount,
                    "category": spending.category.description
                }
                for spending in Spending.select(
                    Spending.amount, Spending.category,
                ).where(Spending.user == user and start_date >= Spending.date >= finish_date)
            ]

            total = 0
            for spending in spendings:
                total += spending["money"]

            chart_info = []
            for curr_category in categories:
                curr_category_amount = 0
                for spending in spendings:
                    if spending["category"] == curr_category:
                        curr_category_amount += spending["money"]
                chart_info.append({"category": curr_category, "money": curr_category_amount/total})

            return {'info': chart_info}, 200
