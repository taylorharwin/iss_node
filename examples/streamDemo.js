var SpaceStream = require('./index.js');

var sampleStream = new SpaceStream(25544, 59);

sampleStream.pipe(process.stdout);

