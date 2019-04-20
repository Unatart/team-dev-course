""" @package database_models
Module for working with db
"""

from peewee import Model, CharField, IntegerField, TextField, DateField, ForeignKeyField
from appconfig import DB


def init_tables():
    """
    Inits tables in given db.
    """
    DB.create_tables([User, Arrival, Category, Spending], safe=True)


def drop_tables():
    """
    Drops tables in given DB
    """
    DB.drop_tables([User, Arrival, Category, Spending])


class BaseModel(Model):
    """Base class for all db models"""
    class Meta:
        """Inherited nested class from peewee.Model"""
        database = DB


class User(BaseModel):
    """Class containing user info
    Attributes:
        username (peewee.CharField): unique username
        email (peewee.CharField): unique email
        password (peewee.CharField): password hash
    """
    username = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField()


class Arrival(BaseModel):
    """Class containing arrival info
    Attributes:
        amount (peewee.IntegerField): amount of money
        description (peewee.TextField): human-readable string to identify arrival
        date (peewee.DateField): date of arrival
        user (peewee.ForeignKeyField): user reference
    """
    amount = IntegerField()
    description = TextField()
    date = DateField()
    user = ForeignKeyField(model=User, on_delete='CASCADE')


class Category(BaseModel):
    """Class containing category info
    Attributes:
        description (peewee.TextField): human-readable string to identify category
        user (peewee.ForeignKeyField): user reference
    """
    description = TextField()
    user = ForeignKeyField(model=User, on_delete='CASCADE')


class Spending(BaseModel):
    """Class containing spending info
    Attributes:
        amount (peewee.IntegerField): amount of money
        description (peewee.TextField): human-readable string to identify spending
        date (peewee.DateField): date of spending
        category (peewee.ForeignKeyField): category of spending
        user (peewee.ForeignKeyField): user reference
    """
    amount = IntegerField()
    description = TextField()
    date = DateField()
    category = ForeignKeyField(model=Category, on_delete='CASCADE')
    user = ForeignKeyField(model=User, on_delete='CASCADE')
