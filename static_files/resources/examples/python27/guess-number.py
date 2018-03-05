#!/usr/bin/python2.7
"""A simple guess the number game ."""
__author__ = "Markus Bordihn"

import random


def main():
  # Asks for the name
  name = raw_input('Hello!\nWhat\'s your name?\n')

  # Start the first round
  guessGame(name)


# Main game logic
def guessGame(name, max_tries=8, numberMin=1, numberMax=20):
  tries = 1
  number = random.randint(numberMin, numberMax)
  guess = int(raw_input(
    'Hi %s.\nGuess the number between %d and %d.\n' % (
      name, numberMin, numberMax)
  ))

  # Repeat
  while tries <= max_tries:

    if guess < number:
        hint = 'low'
    elif guess > number:
        hint = 'high'
    elif guess == number:
        break

    guess = int(raw_input(
      'Your number %d is too %s.\nNext try.\n' % (guess, hint)
  	))

    tries += 1

  # Result
  if guess == number:
    text = '{0} you win!\nYou guess the number with {1} tries!'.format(
      name, tries)
  else:
    text = 'Game Over. I was thinking of the number %d' % (number)

  # New game ?
  repeat = raw_input(
    '%s\nStart a new round (yes/no)?\n' % (text)
  )
  if repeat == 'yes':
    guessGame(name, max_tries-1)


if __name__ == '__main__':
    main()
