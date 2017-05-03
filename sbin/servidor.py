 #To change this license header, choose License Headers in Project Properties.
# To change this template file, choose Tools | Templates
# and open the template in the editor.

__author__ = "Laura Sanchez Morales"
__date__ = "$Nov 21, 2016 9:00:37 AM$"

import os, os.path
import random
import string
import json
import signal
import urllib
import cherrypy
import Adafruit_BBIO.GPIO as GPIO
import Adafruit_BBIO.PWM as PWM

file = open ("../etc/conf.json", "r")
file_conf = file.read ()
file.close ()

host_conf = json.loads (file_conf)

IP = str(host_conf["IP"])
PORT = host_conf["PORT"]


def alarm_clock(signum, frame):
    req1 = urllib.urlopen("http://"+IP+":"+str(PORT)+"/bombillosctrl/1")
    req2 = urllib.urlopen("http://"+IP+":"+str(PORT)+"/ventanasctrl/abrir")
    req3 = urllib.urlopen("http://"+IP+":"+str(PORT)+"/persianasctrl/abrir")
    req4 = urllib.urlopen("http://"+IP+":"+str(PORT)+"/alarmactrl/off/0/00_00_mm")

signal.signal (signal.SIGALRM, alarm_clock)


class Domotica(object):

    #Ventilador
    PinVentilador = "P9_14"
    PWM.start (PinVentilador, 0, 7000, 0)
    ventiladorlevel = 0

    #Ventanas
    PinVentanasAbrir = "P9_21"
    PinVentanasCerrar = "P9_22"
    GPIO.setup(PinVentanasAbrir, GPIO.OUT)
    GPIO.setup(PinVentanasCerrar, GPIO.OUT)

    #Bombillos
    PinBombillo1 = "P9_12"
    GPIO.setup(PinBombillo1, GPIO.OUT)
    bombillo1estado = False

    PinBombillo2 = "P9_18"
    GPIO.setup(PinBombillo2, GPIO.OUT)
    bombillo2estado = False

    PinBombillo3 = "P9_24"
    GPIO.setup(PinBombillo3, GPIO.OUT)
    bombillo3estado = False

    PinBombillo4 = "P9_26"
    GPIO.setup(PinBombillo4, GPIO.OUT)
    bombillo4estado = False

    PinBombillo5 = "P9_30"
    GPIO.setup(PinBombillo5, GPIO.OUT)
    bombillo5estado = False

    #Persianas
    PinPersianasAbrir = "P9_25"
    PinPersianasCerrar = "P9_27"
    GPIO.setup(PinPersianasAbrir, GPIO.OUT)
    GPIO.setup(PinPersianasCerrar, GPIO.OUT)

    #DHT
    llueve = False

    #viaje
    viaje = ""

    #Alarma
    alarma = ""

    @cherrypy.expose
    def ventiladorctrl (self, level_):

        level = int(level_)

        if  (level == 0):
            PWM.set_duty_cycle(self.PinVentilador, 100.0)
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventilador Apagado.'})
            self.ventiladorlevel = 0

        elif (level == 1):
            PWM.set_duty_cycle (self.PinVentilador, 66.66)
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventilador Nivel 1.'})
            self.ventiladorlevel = 1

        elif (level == 2):
            PWM.set_duty_cycle (self.PinVentilador, 33.33)
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventilador Nivel 2.'})
            self.ventiladorlevel = 2

        elif (level == 3):
            PWM.set_duty_cycle (self.PinVentilador, 0.0)
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventilador Nivel 3.'})
            self.ventiladorlevel = 3

        else:
            res = json.dumps ({'Result' : 0, 'Data' : 'Ventilador Estado No Definido.'})

        return res



    @cherrypy.expose
    def ventanasctrl (self, estado_):

        estado = str(estado_)

        if (estado == "abrir"):
            if (not self.llueve):
                GPIO.output(self.PinVentanasAbrir, GPIO.HIGH)
                GPIO.cleanup()
                GPIO.output(self.PinVentanasCerrar, GPIO.LOW)
                GPIO.cleanup()
                res = json.dumps ({'Result' : 1, 'Data' : 'Ventanas Abiertas'})
            else:
                res = json.dumps ({'Result' : 0, 'Data' : 'LLueve Imposible Abrir Ventanas'})

        elif (estado == "cerrar"):
            GPIO.output(self.PinVentanasAbrir, GPIO.LOW)
            GPIO.cleanup()
            GPIO.output(self.PinVentanasCerrar, GPIO.HIGH)
            GPIO.cleanup()
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventanas Cerradas'})

        elif (estado == "parar"):
            GPIO.output(self.PinVentanasAbrir, GPIO.LOW)
            GPIO.cleanup()
            GPIO.output(self.PinVentanasCerrar, GPIO.LOW)
            GPIO.cleanup()
            res = json.dumps ({'Result' : 1, 'Data' : 'Ventanas Entreabiertas'})

        else:
            res = json.dumps ({'Result' : 0, 'Data' : 'Ventanas Estado No Definido.'})

        return (res)



    @cherrypy.expose
    def bombillosctrl(self, bombillo_):

        bombillo = int(bombillo_)
        if (bombillo == 1):
            self.toggle (self.PinBombillo1)
            self.bombillo1estado = True - self.bombillo1estado
            res = json.dumps ({'Result' : 1, 'Data' : 'Bombillo 1 Change'})

        elif (bombillo == 2):
            self.toggle (self.PinBombillo2)
            self.bombillo2estado = True - self.bombillo2estado
            res = json.dumps ({'Result' : 1, 'Data' : 'Bombillo 2 Change'})

        elif (bombillo == 3):
            self.toggle (self.PinBombillo3)
            self.bombillo3estado = True - self.bombillo3estado
            res = json.dumps ({'Result' : 1, 'Data' : 'Bombillo 3 Change'})

        elif (bombillo == 4):
            self.toggle (self.PinBombillo4)
            self.bombillo4estado = True - self.bombillo4estado
            res = json.dumps ({'Result' : 1, 'Data' : 'Bombillo 4 Change'})

        elif (bombillo == 5):
            self.toggle (self.PinBombillo5)
            self.bombillo5estado = True - self.bombillo5estado
            res = json.dumps ({'Result' : 1, 'Data' : 'Bombillo 5 Change'})

        else:
            res = json.dumps ({'Result' : 0, 'Data' : 'Bombillo No Definido.'})

        return (res)



    @cherrypy.expose
    def persianasctrl (self, estado_):

        estado = str(estado_)

        if (estado == "abrir"):
            GPIO.output(self.PinPersianasAbrir, GPIO.HIGH)
            GPIO.cleanup()
            GPIO.output(self.PinPersianasCerrar, GPIO.LOW)
            GPIO.cleanup()
            res = json.dumps ({'Result' : 1, 'Data' : 'Persianas Abiertas'})

        elif (estado == "cerrar"):
            GPIO.output(self.PinPersianasAbrir, GPIO.LOW)
            GPIO.cleanup()
            GPIO.output(self.PinPersianasCerrar, GPIO.HIGH)
            GPIO.cleanup()
            res = json.dumps ({'Result' : 1, 'Data' : 'Persianas Cerradas'})

        elif (estado == "parar"):
            GPIO.output(self.PinPersianasAbrir, GPIO.LOW)
            GPIO.cleanup()
            GPIO.output(self.PinPersianasCerrar, GPIO.LOW)
            GPIO.cleanup()
            res = json.dumps ({'Result' : 1, 'Data' : 'Persianas Entreabiertas'})

        else:
            res = json.dumps ({'Result' : 0, 'Data' : 'Persianas Estado No Definido.'})

        return (res)



    @cherrypy.expose
    def lluviactrl (self,estado_):

        estado = str(estado_)
        if (estado == "si"):
            self.llueve = True
            res = json.dumps ({'Result' : 1, 'Data' : 'LLueve.'})

        elif (estado == "no"):
            self.llueve = False
            res = json.dumps ({'Result' : 1, 'Data' : 'No LLueve.'})

        else:
            res = json.dumps ({'Result' : 0, 'Data' : 'Estado De LLuvia No Definido'})

        return res



    @cherrypy.expose
    def alarmactrl (self, action, seconds_, alarma_):
        seconds = int(seconds_)
        self.alarma = str(alarma_)
        if str(action)=="on":
            signal.alarm(seconds)
            res = json.dumps ({'status' : "on"})
        elif str(action)=="off":
            signal.alarm(seconds)
            res = json.dumps ({'status' : "off"})
        else:
            res = json.dumps ({'status' : "undefined"})
:
    @cherrypy.expose
    def viajectrl (self, action, seconds_, alarma_):
        viaje = str(action)
        if viaje=="on":
            self.viaje = viaje
            res = json.dumps ({'status' : "on"})
        elif viaje=="off":
            self.viaje = viaje
            res = json.dumps ({'status' : "off"})
        else:
            res = json.dumps ({'status' : "undefined"})

        return res



    @cherrypy.expose
    def serverstate (self):
        #Bombillos
        res = json.dumps ({
            'VentiladorLevel' : self.ventiladorlevel,
            'Bombillo1' : int(self.bombillo1estado),
            'Bombillo2' : int(self.bombillo2estado),
            'Bombillo3' : int(self.bombillo3estado),
            'Bombillo4' : int(self.bombillo4estado),
            'Bombillo5' : int(self.bombillo5estado),
            'Alarma' : self.alarma,
            "LLegando" : self.llegando
        })

        return res



    def toggle (self, Pin):
        if (GPIO.input(Pin)):
            GPIO.output(Pin, GPIO.LOW)
            GPIO.cleanup()
        else:
            GPIO.output(Pin, GPIO.HIGH)
            GPIO.cleanup()



if __name__ == "__main__":

    conf = {
        '/' : {
            'tools.staticdir.root' : os.path.abspath(os.getcwd()),
            'tools.staticdir.on' : True,
            'tools.staticdir.dir' : '../share/'
        },

        '/bin' : {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir' : '../bin'
        },

        '/boot' : {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir' : '../boot'
        },

        '/lib' : {
            'tools.staticdir.on' : True,
            'tools.staticdir.dir' : '../lib'
        },

    }

    cherrypy.config.update({
        'server.socket_host': IP,
        'server.socket_port': PORT,
    })

    cherrypy.quickstart(Domotica(), '/', conf)
