import os
from app import APP

if __name__ == "__main__":
    APP.secret_key = 'someSecret'
    port = int(os.environ.get("PORT", 5000))
    APP.run(host='0.0.0.0', port=port)
