
import sys
from random import shuffle

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

from brains import Brains

app = Flask(__name__)
socketio = SocketIO(app)
brains = Brains()
chooser = ""


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/play')
def redirect_to_home():
    return redirect(url_for('index'))


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        username = request.form['target']
        print("\nREMOVING", username)
        brains.players_remove(username)

    return render_template('admin.html', players=brains.players_get())


@app.route('/play/<username>', methods=['GET', 'POST'])
def play_user(username):
    # TODO: check if username actually exists
    return render_template('play.html', username=username[:32])


#
# SOCKET I/O
@socketio.on('user connect')
def user_connect(username):
    print("\nCONNECTING:", username['data'])
    # new player with 0 points created
    if brains.players_add(username['data']):
        print("CONNECTED:", username['data'])
    else:
        print(username['data'], "FAILED TO CONNECT")
    return


def update_leaderboard():
    emit('update leaderboard', brains.players_get(), broadcast=True)


@socketio.on('ping')
def ping():
    print("\nPING")
    emit('ping out', broadcast=True)

#
# HELPER FUNCTIONS


def main():
    print(sys.argv)
    IP = 'localhost'
    PORT = 8080

    if len(sys.argv) == 2:
        IP = sys.argv[1]
    if len(sys.argv) == 3:
        IP = sys.argv[1]
        PORT = sys.argv[2]

    try:
        app.run(debug=True, host=IP, port=PORT)
    except:
        print("INVALID HOSTNAME")


if __name__ == '__main__':
    # main()
    app.run(debug=True, host='localhost', port=8080)
