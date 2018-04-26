import time
from gpiozero import MotionSensor

pir = MotionSensor(4)

time.sleep(3)

if pir.motion_detected:
    print('1')
else:
    print('0')
