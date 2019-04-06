from routes.database import *
from appconfig import app

if __name__ == '__main__':
    app.run(threaded=True, debug=False)