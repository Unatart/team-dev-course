from passlib.hash import pbkdf2_sha256
from database_models import User, Arrival, Category, Spending
from validator import Validator


def generate_password_hash(password):
    return pbkdf2_sha256.encrypt(password, rounds=200000, salt_size=16)


class Repository:
    def __init__(self, database):
        self.database = database

    def create_user(self, user):
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

    def add_arrival(self, req):
        with self.database.atomic():
            db_user = User.get(User.username == req['username'])

            amount = req['amount']
            description = req['description']
            date = req['date']

            new_arrival = Arrival(amount=amount, description=description, date=date, user=db_user)
            new_arrival.save()

            return {'id': new_arrival.get_id()}, 201

    def update_arrival(self, req, arrival_id):
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
        with self.database.atomic():
            user = User.get(User.username == req['username'])
            description = req['description']

            category = Category(description=description, user=user)
            category.save()

            return {'id': category.get_id()}, 201

    def add_spending(self, req):
        with self.database.atomic():
            user = User.get(User.username == req['username'])

            amount = req['amount']
            description = req['description']
            date = req['date']
            category = Category.get(Category.id == req['category_id'] and Category.user == user)

            spending = Spending(amount=amount, description=description, date=date, category=category, user=user)
            spending.save()

            return {'id': spending.get_id()}, 201

    def update_spending(self, req, spending_id):
        with self.database.atomic():
            user = User.get(User.username == req['username'])

            spending = Spending.get_by_id(spending_id)
            if spending is not None:
                if spending.user == user:
                    spending.amount = req['amount']
                    spending.description = req['description']
                    spending.date = req['date']
                    spending.category = Category.get(Category.id == req['category_id'] and Category.user == user)
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
        with self.database.atomic():
            user = User.get(User.username == username)

            arrivals = [
                {
                    "amount": arrival.amount,
                    "date": str(arrival.date),
                    "id": arrival.id
                }
                for arrival in Arrival.select(
                    Arrival.amount, Arrival.description, Arrival.date, Arrival.id
                ).where(Arrival.user == user)
            ]

            categories = [
                {
                    "description": category.description,
                    "id": category.id
                }
                for category in Category.select(
                    Category.description, Category.id
                ).where(Category.user == user)
            ]

            spendings = [
                {
                    "amount": spending.amount,
                    "date": str(spending.date),
                    "category": spending.category.description,
                    "id": spending.id
                }
                for spending in Spending.select(
                    Spending.amount, Spending.description, Spending.date, Spending.category, Spending.id
                ).where(Spending.user == user)
            ]

            return {
                'arrivals': arrivals, 'categories': categories, 'spendings': spendings, 'user': user.username
            }, 200
