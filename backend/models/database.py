from appconfig import db
from peewee import *


def init_tables():
    db.create_tables([User], safe=True)


def drop_tables():
    db.drop_tables([User])


class BaseModel(Model):
    class Meta:
        database = db


class User(BaseModel):
    username = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField()
