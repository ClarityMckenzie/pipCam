// importing tools

const request = require('request');
const fs = require('fs');
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const http = require('http');
require('dotenv').config();

// spin up an ngrok tunnel

const args = [process.env.MY_NGROK]

function startNgrok() {
exec(`./ngrok ${args}`)
};

startNgrok();


// take picture on raspberrypi with raspistill command, save as timestamp.jpg to pictureAlbum array

const imageWidth = 640;
const imageHeight = 480;
let pictureAlbum = [];

function takePicture() {
    const name = Date.now() + '.jpg';
    const args = ['-w', imageWidth, '-h', imageHeight, '-vf', '-hf',
'-o', name];
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
                channels: "process.env.MY_CHANNEL",
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

        let result = parseInt('${data}');
        if (result === 1) {
            takePicture();
            setTimeout(function() {
                upload(pictureAlbum[0]);
            }, 10000)
        } else {
            noCatReport();
        }
    });
    res.end("Where's the cat at? We'll post our findings in <#CABBY6CQ1>.");

}).listen(process.env.MY_PORT);
