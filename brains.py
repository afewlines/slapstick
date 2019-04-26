import trivia


class Brains(object):
    """docstring for Brains."""

    def __init__(self, rounds=3):
        self.players = {}
        self.trivia_pot = None
        self.answer_pot = {}
        self.rounds = rounds
        self.current = 0
        self.admin_functions = {'remove': lambda user: self.players_remove(user),
                                'reset score': lambda user: self.players_reset(user),
                                'goof': lambda user: print('lmao @ {}'.format(user))}

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

    def get_active(self):
        if self.trivia_pot:
            return self.trivia_pot.get_active()
        else:
            return False

    def get_question(self):
        return self.trivia_pot.get_question()

    def get_answer(self):
        return self.trivia_pot.get_answer()

    def get_answers(self):
        return self.trivia_pot.get_answers_shuffled()

    def players_get(self):
        return self.players

    def players_find(self, target):
        return target in self.players

    def players_get_top(self):
        if len(self.players) < 1:
            return ""

        players = [key for key in self.players]
        highest = [players[0]]
        for player in players[1:]:
            if self.players[player] > self.players[highest[0]]:
                highest = [player]
            elif self.players[player] == self.players[highest[0]]:
                highest.append(player)

        return ', '.join(highest)

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
            if target in self.answer_pot:
                self.answer_pot.pop(target)
            self.players.pop(target)
            return True
        else:
            return False

    def players_reset(self, target):
        self.players[target] = 0

    def player_point(self, target):
        self.players[target] += 1

    def answer_pot_check(self):
        print(len(self.answer_pot), len(self.players))
        return len(self.answer_pot) >= len(self.players)

    def answers_clear(self):
        self.answer_pot = {}

    def answers_submit(self, data):

        if data[0] in self.players:
            self.answer_pot[data[0]] = data[1]
        else:
            print("INVALID SUBMISSION")
            return False

        return self.answer_pot_check()

    def check(self, target):
        return self.trivia_pot.check_answer(target)

    def answers_check(self):
        temp = self.answer_pot
        self.answer_pot = {}
        for submission in temp:
            print(submission, temp[submission])
            temp[submission] = self.trivia_pot.check_answer(
                temp[submission])
            print(submission, temp[submission])

        for player in temp:
            if temp[player

                    ]:
                self.player_point(player)

        return [self.get_answer(), temp]

    def admin(self, target, operation):
        return self.admin_functions[operation](target)
