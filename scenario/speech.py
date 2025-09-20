import pandas as pd
import numpy as np
import pyttsx3
import speech_recognition as sr

r=sr.Recognizer()
engine=pyttsx3.init()
voice=engine.getProperty('voices')
engine.setProperty('voice',voice[0].id)
engine.setProperty("rate",180)

def speech():
    engine.say("Heyyy!!")
    engine.runAndWait()
    engine.say("I'm the co-founder for your startup and I'm here to help. What are you looking for and which feature do you wanna explore?")
    engine.runAndWait()

speech()