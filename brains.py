class Brains(object):
    """docstring for Brains."""

    def __init__(self):
        self.players = {}

    def players_get(self):
        return self.players

    def players_add(self, target):
        if target in self.players:
            return False
        else:
            self.players[target] = [0]
            return True

        return False

    def players_remove(self, target):
        if target in self.players:
            return self.players.pop(target)
        else:
            return False
