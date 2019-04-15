from peewee import Model, CharField, IntegerField, TextField, DateField, ForeignKeyField
from appconfig import DB


def init_tables():
    DB.create_tables([User, Arrival, Category, Spending], safe=True)


def drop_tables():
    DB.drop_tables([User, Arrival, Category, Spending])


class BaseModel(Model):
    class Meta:
        database = DB


class User(BaseModel):
    username = CharField(unique=True)
    email = CharField(unique=True)
    password = CharField()


class Arrival(BaseModel):
    amount = IntegerField()
    description = TextField()
    date = DateField()
    user = ForeignKeyField(model=User, on_delete='CASCADE')


class Category(BaseModel):
    description = TextField()
    user = ForeignKeyField(model=User, on_delete='CASCADE')


class Spending(BaseModel):
    amount = IntegerField()
    description = TextField()
    date = DateField()
    category = ForeignKeyField(model=Category, on_delete='CASCADE')
    user = ForeignKeyField(model=User, on_delete='CASCADE')
