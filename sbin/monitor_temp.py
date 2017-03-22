# To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

__author__ = "Laura Sanchez Morales"
__date__ = "$Nov 21, 2016 9:00:37 AM$"

import urllib
import Adafruit_DHT
import time
import json

file = open ("../etc/conf.json", "r")
file_conf = file.read ()
file.close ()
    
host_conf = json.loads (file_conf)

IP = host_conf["IP"]
PORT = host_conf["PORT"]


if __name__ == "__main__":
    
    PinSensor = 'P9_41'
    TipoSensor = Adafruit_DHT.DHT11
    
    while (1):
         
        humidity, temperature = Adafruit_DHT.read_retry(TipoSensor, PinSensor)
        if humidity is not None and temperature is not None:
            if (int(humidity) > 75):
                req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/lluviactrl/si")
                req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/ventanasctrl/cerrar")
            else:
                req = urllib.urlopen("http://"+IP+":"+str(PORT)+"/lluviactrl/no")
        
        time.sleep (2)
        