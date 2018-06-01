import os
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(26, GPIO.IN, pull_up_down=GPIO.PUD_UP)

counter = 0

while True:
        if GPIO.input(26) == True:
                counter += 1
                print(counter)
                if counter > 100000:
                        os.system("sudo shutdown -h now")
