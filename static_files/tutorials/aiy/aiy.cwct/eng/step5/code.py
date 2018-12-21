from aiy.board import Board, Led
from aiy.leds import (Leds, Color)

color = Leds.rgb_on(Color.BLUE)

with Leds() as leds:
  with Board() as board:
    leds.update(color)
    on = True
    while True:
      board.button.wait_for_press()
      if on:
        print('OFF')
        board.led.state = Led.OFF
        on = False
      else:
        print('ON')
        leds.update(color)
        on = True
