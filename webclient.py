
import sys
from random import shuffle

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)
players = {}  # {"drongle": [0, []], "dingle": [4, []]}
global chooser_ordered
chooser_ordered = []
global card_pot
card_pot = []
current_prompt = None
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
        global chooser_ordered
        username = request.form['target']
        print("\nREMOVING", username)
        players.pop(username)
        chooser_ordered = [
            user for user in chooser_ordered if user != username]

    return render_template('admin.html', players=players)


@app.route('/play/<username>', methods=['GET', 'POST'])
def play_user(username):
    # TODO: check if username actually exists
    return render_template('play.html', username=username[:32])


#
# SOCKET I/O
@socketio.on('user connect')
def user_connect(username):
    print("\nCONNECTING", username['data'])
    # new player with 0 points created
    players[username['data']] = [0]
    return


@socketio.on('ping')
def ping():
    print("\nPING")

#
# HELPER FUNCTIONS


def update_leaderboard():
    leaderboard = ["{}: {}".format(player, players[player][0])
                   for player in players]
    emit('update leaderboard', "|".join(leaderboard), broadcast=True)


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
