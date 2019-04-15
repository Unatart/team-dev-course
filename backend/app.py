from flask import Flask
from flask_cors import CORS

from routes import ECONOMICS_APP


APP = Flask(__name__)
APP.register_blueprint(ECONOMICS_APP)
CORS(APP, supports_credentials=True)


if __name__ == '__main__':
    APP.run(threaded=True, debug=False)
