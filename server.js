const fs = require('fs');
const csv = require('fast-csv');

var script = [];

fs.createReadStream("script.csv")
    .pipe(csv())
    .on("data", function(data){
        if(data[0] != 'Time (Sec)')
            script.push({
                time: data[1],
                text: data[4]
            })
    })
    .on("end", function(){
       
    });

var textToSpeech = require('./lib/text-to-speech.js');


//host web server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var port = 3300;

//call other web endpoints
var sendRequest = require('request');

//for hosting content without webpack
app.use(express.static('public'));


app.get('/api/get-script', (request, response) => {

    var scriptCopy =  JSON.parse(JSON.stringify(script));

    textToSpeech.toSpeechBulk(scriptCopy,'aws')
    .then(function(filePaths) {
        response.send(filePaths);
    })
});

server.listen(port);