import trivia


class Brains(object):
    """docstring for Brains."""

    def __init__(self, rounds=10):
        self.players = {}
        self.trivia_pot = None
        self.answer_pot = {}
        self.rounds = rounds
        self.current = 0

    def start_game(self):
        self.current = 0
        self.trivia_pot = trivia.load_trivia_questions()

    def next_question(self):
        if self.current <= self.rounds:
            self.current += 1
            self.trivia_pot.new_question()
            return True
        else:
            return False

    def players_get(self):
        return self.players

    def players_add(self, username):
        print("\nCONNECTING:", username, type(username))
        print(self.players)
        if username in self.players:
            print(username, "FAILED TO CONNECT")
            return False
        else:
            self.players[username] = 0
            print("CONNECTED:", username)
            return True

        return False

    def players_remove(self, target):
        if target in self.players:
            return self.players.pop(target)
        else:
            return False

    def players_find(self, target):
        return target in self.players

    def get_question(self):
        return self.trivia_pot.get_question()

    def get_answer(self):
        return self.trivia_pot.get_answer()

    def get_answers(self):
        return self.trivia_pot.get_answers_shuffled()

    def check(self, target):
        return self.trivia_pot.check_answer(target)

    def answers_clear(self):
        self.answer_pot = {}

    def answers_submit(self, data):
        self.answer_pot[data[0]] = data[1]
        print(len(self.answer_pot), len(self.players))
        if len(self.answer_pot) >= len(self.players):
            return True
        return False

    def answers_check(self):
        temp = self.answer_pot
        self.answer_pot = {}
        for submission in temp:
            print(submission, temp[submission])
            temp[submission] = self.trivia_pot.check_answer(
                temp[submission])
            print(submission, temp[submission])

        return [self.get_answer(), temp]
