import os

from flask import Flask
from peewee import PostgresqlDatabase
from flask_cors import CORS


APP = Flask(__name__)
CORS(APP, supports_credentials=True)

DB = PostgresqlDatabase(
    os.environ.get('ECONAPP_DATABASE'),
    user=os.environ.get('ECONAPP_DATABASE_USER'),
    password=os.environ.get('ECONAPP_DATABASE_PASSWORD'),
    host=os.environ.get('ECONAPP_DATABASE_HOST', 'localhost')
)
