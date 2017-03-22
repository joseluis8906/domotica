# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

__author__ = "Laura Sanchez Morales"
__date__ = "$Nov 21, 2016 9:00:37 AM$"

import urllib
import Adafruit_BBIO.GPIO as GPIO
import time
import json

file = open ("../etc/conf.json", "r")
file_conf = file.read ()
file.close ()
    
host_conf = json.loads (file_conf)

IP = host_conf["IP"]
PORT = host_conf["PORT"]

if __name__ == "__main__":
    
    PinBombillo1 = 'P9_11'
    PinBombillo2 = 'P9_13'
    PinBombillo3 = 'P9_15'
    PinBombillo4 = 'P9_17'
    PinBombillo5 = 'P9_23'
    
    GPIO.setup(PinBombillo1, GPIO.IN)
    GPIO.setup(PinBombillo2, GPIO.IN)
    GPIO.setup(PinBombillo3, GPIO.IN)
    GPIO.setup(PinBombillo4, GPIO.IN)
    GPIO.setup(PinBombillo5, GPIO.IN)
    
    GPIO.add_event_detect (PinBombillo1, GPIO.FALLING)
    GPIO.add_event_detect (PinBombillo2, GPIO.FALLING)
    GPIO.add_event_detect (PinBombillo3, GPIO.FALLING)
    GPIO.add_event_detect (PinBombillo4, GPIO.FALLING)
    GPIO.add_event_detect (PinBombillo5, GPIO.FALLING)
        
    
    while (1):
        
        if GPIO.event_detected (PinBombillo1):
            req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/1")
        
        if GPIO.event_detected (PinBombillo2):
            req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/2")
           
        if GPIO.event_detected (PinBombillo3):
            req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/3")
           
        if GPIO.event_detected (PinBombillo4):
            req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/4")
            
        if GPIO.event_detected (PinBombillo5):
            req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/5")    
            
        time.sleep (0.5)
        