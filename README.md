# Speech-to-text script reader

*Research/prototype code ... pardon the mess.*

### Motivation
Speech-to-text has come a long way. The purpouse of this project is to test the technology by exploring its viability for guided meditation or customised priming. 
e.g. https://www.tonyrobbins.com/priming-exercise/

### Current State
The tech is better than I expected but it's still clear that the voice is automated. The question is: does that matter? Perhaps that's OK and a solution just needs to own it by introducing a non-human character to go along with the voice?

![Script Definition](https://github.com/iskornienko/script-reader/blob/master/sample-screen.png?raw=true)

### Overview
* For google, place the keyfile in /lib by following https://cloud.google.com/bigquery/docs/authentication/service-account-file
* For AWS, follow https://aws.amazon.com/sdk-for-node-js/
* Update script.csv with what you want the app to say. Only the first and 5th columns matter for the processor.

### Setup
`npm install`

`node ./server.js`, open browser to: http://localhost:3300/, & wait a few moments. Processing time depends on how big the script is.

