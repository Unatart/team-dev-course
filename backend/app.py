""" @package app
Point of entry for flask backend server app

Attributes:
    APP (flask.Flask): application object
"""

from flask import Flask
from flask_cors import CORS

from routes import ECONOMICS_APP

APP = Flask(__name__)
APP.register_blueprint(ECONOMICS_APP)
CORS(APP, supports_credentials=True)


def main():
    """Main function
    """
    APP.run(threaded=True, debug=False)


if __name__ == '__main__':
    main()
