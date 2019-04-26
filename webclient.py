
import sys

from flask import Flask, redirect, render_template, request, url_for
from flask_socketio import SocketIO, emit

from brains import Brains

app = Flask(__name__)
socketio = SocketIO(app, ping_interval=15)
brains = Brains()
chooser = ""
index = 0


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


def update_game():
    get_players()
    if not brains.next_question():
        return False
    emit('update question', brains.get_question(), broadcast=True)
    emit('update answers', brains.get_answers(), broadcast=True)
    return True


@socketio.on('force check')
def check_answers():
    global brains
    result = brains.answers_check()
    emit('result', result, broadcast=True)
    print(result)
    if not update_game():
        emit('end', brains.players_get_top(), broadcast=True)
        brains = Brains()


@socketio.on('user connect')
def user_connect(username):
    username = username['data']
    print('here', username, type(username))
    emit('play', [brains.players_add(username), username])


@socketio.on('players get')
def get_players():
    print(brains.players_get())
    emit('players list', brains.players_get(), broadcast=True)


@socketio.on('request update')
def req_question():
    if brains.get_active():
        emit('update question', brains.get_question())
        emit('update answers', brains.get_answers())


@socketio.on('start game')
def start_game():
    print("\nSTARTING")
    index = 0
    if index < 1:
        brains.start_game()
    update_game()


@socketio.on('submit')
def submit(data):
    print(data)
    if brains.answers_submit(data):
        check_answers()


@socketio.on('admin')
def admin_commands(payload):
    payload[1] = payload[1].lower()
    if brains.admin(*payload):
        get_players()
        if brains.answer_pot_check():
            check_answers()


@socketio.on('ping')
def ping():
    print("\nPING")
    emit('ping out', broadcast=True)

#
# HELPER FUNCTIONS


def start_server():
    # print(sys.argv)
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
        print("SERVER NOT STARTED")


if __name__ == '__main__':
    start_server()
    # app.run(debug=True, host='localhost', port=8080)
