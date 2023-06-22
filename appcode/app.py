from flask import Flask, render_template
from datetime import datetime

app = Flask(__name__)
start_time = datetime.now()

@app.route('/uptime', methods=['GET'])
def uptime():
    uptime = (datetime.now() - start_time).total_seconds()
    return render_template('uptime.html', uptime=str(uptime))

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=80)

#  from flask import Flask, jsonify
# from datetime import datetime

# app = Flask(__name__)
# start_time = datetime.now()

# @app.route('/uptime', methods=['GET'])
# def uptime():
#     uptime = datetime.now() - start_time
#     return jsonify({'uptime': str(uptime)})

# if __name__ == "__main__":
#     app.run(host='0.0.0.0', port=80)
