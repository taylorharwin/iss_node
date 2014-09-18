iss_node
========
iss_node is a module that generates a readable stream based on a given satellite's location in orbit. All data comes from the wheretheiss.at API: [http://wheretheiss.at/w/developer]( http://wheretheiss.at/w/developer), and is wrapped using Node's stream.Readable API.

You might use this stream to visualize the position of a given satelite at any time in a client application, or to generate Tweets whenever a satellite passes a certain location. These use-cases are available at [http://wheretheiss.at/](http://wheretheiss.at/).

This project was an exercise in learning about the Node streaming API. It works, and has test coverage, but there may be bugs. Please submit pull requests for any issues you may come across.

##Installation 

(Assumes you have Node and NPM installed)

1. Clone this repository locally and `cd` into it
2. Type `npm pack`, which will create a .tgz of the repo in the same directory
3. `cd` to the top-level directory for your project where you are using iss_node
4. Type `npm install path/to/filename.tgz`, which will install the module in your node_modules folder, or create the folder if none exists.

###Use

Require the module, and set it equal to a constructor, i.e: `var SpaceStream = require('iss_node')`
A stream takes two parameters: 
1. Satelite ID (the NORAD id for a satelite: They are available at http://www.celestrak.com/pub/satcat.txt)
2. Frequence (The number of times per minute to request new data from the wheretheiss.at API: e.g. 30 = one request every .5 seconds, .5 equals one request every two minutes. Must be greater than 0, less than 60).
3. Consume the stream however you wish. Please refer to Node's documentation for more info: [http://nodejs.org/api/stream.html](http://nodejs.org/api/stream.html).
4. Refer to the two examples in the "examples" folder for more implementation details. 

###Examples

1. streamDemo.js --- Creates a new stream for the ISS (25544), makes requests 59 times/minute, and then pipes the result to process.stdout
2. deltaLatLong.js --- Implements a Transform stream that changes a satelite location object into a new object that shows the rate of change per minute of latitude, as well as the rate of change per minute of longitude. Calculation details are in the file. 

###Tests
(Assumes you have mocha installed globally)

Tests for this module are written in Mocha, and can be run from inside the iss_node directory with:
`npm test`

###Contact
If you have any questions or concerns, you can reach the developer at taylor.harwin@gmail.com, or on Twitter: @taylorharwin