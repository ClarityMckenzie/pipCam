# pipCam

![The Machine](https://github.com/ClarityMckenzie/pipCam/blob/master/pipcam.jpg)

What:

pipCam is a Raspberry Pi program built with NodeJS and Python. It can be triggered from Slack with the command, /pipcam. If motion is detected near the Raspberry Pi, it will take a picture and upload it to Slack.  

How: 

mother.sh launches on boot, allowing on.py to run the main program, pipcam.js, with a single click of the input button. mother.sh also runs off.py, allowing the Raspbery Pi to be safely shutdwn by holding the input button for 10 seconds. 

pipcam.js starts an HTTP server with an ngrok tunnel. When requested, pipcam.js will query the Python child process, motion_detector.py. If that detects motion, it will take a raspistill image and send it to Slack with the files.upload API method. Otherwise, it will use the chat.postMessage API method to let you know the cat couldn't be found. 

- Raspberry Pi with Raspbian
- Raspberry Pi camera
- motion sensor
- input button 
- jumper cables

Why: 

It's nice to check on my cat during the work day. The project was inspired by @girliemac's KittyCam, but unfortunately, the KittyDar package is no longer supported. https://github.com/girliemac/RPi-KittyCam

