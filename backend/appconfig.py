import os

from flask import Flask
from peewee import PostgresqlDatabase
from flask_cors import CORS


app = Flask(__name__)
CORS(app, supports_credentials=True)

db = PostgresqlDatabase(
    os.environ.get('ECONAPP_DATABASE'),
    user=os.environ.get('ECONAPP_DATABASE_USER'),
    password=os.environ.get('ECONAPP_DATABASE_PASSWORD'),
    host=os.environ.get('ECONAPP_DATABASE_HOST', 'localhost')
)
