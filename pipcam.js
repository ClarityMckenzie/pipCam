const request = require('request');
const fs = require('fs');
const spawn = require('child_process').spawn;
const http = require('http');
require('dotenv').config();

let imageWidth = 640;
let imageHeight = 480;
let pictureAlbum = [];

// take picture on raspberrypi with raspistill command, save as timestamp.jpg to pictureAlbum array

function takePicture() {
    const name = Date.now() + '.jpg';
    const args = ['-w', imageWidth, '-h', imageHeight, '-o', name];
    spawn('raspistill', args);
    pictureAlbum.unshift(`${name}`);
    console.log(`We saved the photo as ${name}.`);
};


// use files.upload method with bot token to post picture to #pipcam-updates

function upload(newPic) {
    console.log("Hopefully uploading...");
    request.post({
            url: 'https://slack.com/api/files.upload',
            formData: {
                token: process.env.MY_BOT_TOKEN,
                channels: "CABBY6CQ1",
                title: "Your cat, as requested",
                filetype: "auto",
                file: fs.createReadStream(newPic),
            },
        },

        function(err) {
            console.log("The takePicture function didn't work. What went wrong?", err)
        });
};

// use chat.postMessage method with bot token to post error message to #pipcam-updates

function noCatReport() {
    console.log("Posting, we think...");
    request.post({
            url: process.env.MY_FAILURE_MESSAGE
        },
        function(err) {
            console.log("The noCatReport function didn't work. What went wrong?", err)
        });
};

// start http server. request will launch python child process to detect motion. if it returns a '1'/true, takePicture. after 10 seconds, upload the first picture in pictureAlbum array. otherwise, run noCatReport function to send error message. 

http.createServer(function(req, res) {

    const motionSensor = spawn('python', ['motion_detector.py']);

    motionSensor.stdout.on('data', function(data) {

        let result = parseInt(`${data}`);
        if (result === 1) {
            takePicture();
            setTimeout(function() {
                upload(pictureAlbum[0]);
            }, 10000)
        } else {
            noCatReport();
            console.log("No cats 'round here!'")
        }
    });
    res.end("Where's the cat at? We'll post our findings in <#CABBY6CQ1>.");

}).listen(process.env.MY_PORT);
