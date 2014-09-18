var SpaceStream = require('../lib/index');

var sampleStream = new SpaceStream(25544, 59);

sampleStream.pipe(process.stdout);

