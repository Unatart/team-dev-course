import os

from peewee import PostgresqlDatabase

DB = PostgresqlDatabase(
     os.environ.get('ECONAPP_DATABASE'),
     user=os.environ.get('ECONAPP_DATABASE_USER'),
     password=os.environ.get('ECONAPP_DATABASE_PASSWORD'),
     host=os.environ.get('ECONAPP_DATABASE_HOST', 'localhost')
)