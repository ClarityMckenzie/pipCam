from Naked.toolshed.shell import execute_js, muterun_js
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(26, GPIO.IN, pull_up_down=GPIO.PUD_UP)

while True:
        if GPIO.input(26) == True:
                print("Your program is starting")
                program = execute_js('pipcam.js')
