#!/usr/bin/python
"""Turtle Graphics"""
import turtle
t=turtle.Turtle("turtle")
t.width(5)
t.penup()
t.goto(-100, 0)

t.pendown()
t.color('red')
t.forward(150)
t.right(120)
t.color('green')
t.forward(150)
t.right(120)
t.color('blue')
t.forward(150)

t.penup()
t.goto(-65, 40)
t.pendown()
t.color('gray')
t.write('Hello World', font=("Arial", 20, "normal"))

turtle.done()
