const fs = require('fs');

var Promise = require('promise');

const AWS = require('aws-sdk');

// Create an Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'us-east-1'
})

// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');

// Creates a client
const client = new textToSpeech.TextToSpeechClient({
  keyFilename: 'lib/google-keyfile.json'
});

var crypto = require('crypto');

function toSpeechImplementation(text, service) {
  // Construct the request
  const gRequest = {
    input: {text: text},
    // Select the language and SSML Voice Gender (optional)
    voice: {
      languageCode: 'en-US',
      name: "en-US-Wavenet-D"
    },
    // Select the type of audio encoding
    audioConfig: {
      audioEncoding: 'MP3',
      pitch: "-3.50",
      speakingRate: "0.85"
    },
  };

  const awsRequest = {
    'Text': '<speak>'+text+'</speak>',
    'OutputFormat': 'mp3',
    'VoiceId': 'Matthew',
    'TextType': "ssml", 
  }

  var fileName = crypto.createHash('md5').update(JSON.stringify(service == 'google' ? gRequest : awsRequest)).digest("hex")+'.mp3';
  var filePath = 'public/audio-files/'+fileName;

  return new Promise(function (resolve, reject) {


    if(fs.existsSync(filePath)) {
      resolve(filePath);
    } else {

      if(service == 'google') {
        client.synthesizeSpeech(gRequest, (err, response) => {
          if (err) {
            reject('ERROR:', err);
          }
          // Write the binary audio content to a local file
          fs.writeFile(filePath, response.audioContent, 'binary', err => {
            if (err) {
              reject('ERROR:', err);
            } else {
              resolve(filePath);
            }
          });
        });
      } else {
        Polly.synthesizeSpeech(awsRequest, (err, data) => {
          if (err) {
            reject('ERROR:', err);
          } else if (data) {
              if (data.AudioStream instanceof Buffer) {
                  fs.writeFile(filePath, data.AudioStream, function(err) {
                      if (err) {
                        reject('ERROR:', err);
                      } else {
                        resolve(filePath);
                      }
                  })
              }
          }
      })
      }
    }
  });

}

function toSpeechBulkImplementation(textList, resultList, service) {

  return new Promise(function (resolve, reject) {
    toSpeechImplementation(textList[0].text, service).then(function (filePath) {

      textList[0].file = filePath;
      resultList.push(textList[0]);
      textList.splice(0,1)

      if(textList.length > 0) {
        resolve(toSpeechBulkImplementation(textList, resultList, service))
        
      } else {
        resolve(resultList)
      }

    });
  });
}


exports.toSpeech = function (text, service) {
  return toSpeechImplementation(text, service);
};

exports.toSpeechBulk = function(textList, service) {
  return toSpeechBulkImplementation(textList, [], service)
}
