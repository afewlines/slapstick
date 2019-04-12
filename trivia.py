import csv
from random import shuffle


class TriviaPot():
    """docstring for TriviaPot."""

    def __init__(self, contents):
        self.contents = []
        self.old = contents
        self.current = None

    def get_question(self):
        if self.current == None:
            return ""
        return self.current.get_question()

    def get_answers(self):
        if self.current == None:
            return []
        return self.current.get_answers()

    def get_answers_shuffled(self):
        if self.current == None:
            return []
        return self.current.get_answers_shuffled()

    def check_answer(self, target):
        if self.current == None:
            return False
        return self.current.check_answer(self.get_answers_shuffled()[target - 1])

    def display(self):
        print("QUESTION:\n\t{}".format(self.get_question()))
        i = 0
        for anr in self.get_answers_shuffled():
            i += 1
            print("\t{:<2}{}".format(i, anr))

    def get_number(self):
        print(len(self.contents) + len(self.old))
        return len(self.contents) + len(self.old)

    def new_question(self):

        assert self.get_number() > 0, "Questions not loaded!"
        if len(self.contents) < 1:
            shuffle(self.old)
            self.contents = self.old
            self.old = []

        if self.current != None:
            self.old.append(self.current)

        self.current = self.contents.pop()


class TriviaQuestion():
    """docstring for TriviaQuestion."""

    def __init__(self, question, answers):
        self.question = question
        self.answers = (answers[0], answers[1:])
        self.answers_shuffled = answers
        shuffle(self.answers_shuffled)

    def get_question(self):
        return self.question

    def get_answers(self):
        return [self.answers[0]] + self.answers[1]

    def get_answers_shuffled(self):
        return self.answers_shuffled

    def check_answer(self, target):
        return target == self.answers[0]

    def display(self):
        print("QUESTION:\n\t{}".format(self.question))
        print("CORRECT ANSWER:\n\t{}".format(self.answers[0]))
        print("INCORRECT ANSWERS:")
        for answer in self.answers[1]:
            print("\t{}".format(answer))


def load_trivia_questions():
    pot_out = []

    with open('trivia_file.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        for row in csv_reader:
            print(len(row))
            temp = TriviaQuestion(row[0], row[1:])
            pot_out.append(temp)
        print("Processed {} Questions".format(len(pot_out)))

    return TriviaPot(pot_out)


def main():
    return load_trivia_questions()


if __name__ == '__main__':
    debug = main()
