from routes.database import *
from appconfig import APP

if __name__ == '__main__':
    APP.run(threaded=True, debug=False)
