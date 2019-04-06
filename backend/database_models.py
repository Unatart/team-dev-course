from peewee import Model, CharField
from appconfig import DB


def init_tables():
    DB.create_tables([User], safe=True)


def drop_tables():
    DB.drop_tables([User])


class BaseModel(Model):
    class Meta:
        database = DB


class User(BaseModel):
    username = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField()
