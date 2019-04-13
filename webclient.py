
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
def play():
    return redirect(url_for('index'))


@app.route('/admin', methods=['GET', 'POST'])
def admin():
    if request.method == 'POST':
        username = request.form['target']
        print("\nREMOVING", username)
        brains.players_remove(username)

    return render_template('admin.html', players=brains.players_get())


@app.route('/play/<username>')
def play_user(username):
    # TODO: check if username actually exists
    print('hey,', username)
    if brains.players_find(username):
        return render_template('play.html', username=username[:32])
    else:
        return redirect(url_for('index'))


#
# SOCKET I/O

def update_leaderboard():
    emit('update leaderboard', brains.players_get(), broadcast=True)


@socketio.on('user connect')
def user_connect(username):
    emit('play', [brains.players_add(username), username])


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
