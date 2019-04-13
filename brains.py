class Brains(object):
    """docstring for Brains."""

    def __init__(self):
        self.players = {}

    def players_get(self):
        return self.players

    def players_add(self, username):

        print("\nCONNECTING:", username)
        if username in self.players:
            print(username, "FAILED TO CONNECT")
            return False
        else:
            self.players[username] = [0]
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
