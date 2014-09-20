var SpaceStream = require('../lib/index');

var sampleStream = new SpaceStream(25544, 30);

sampleStream.setEncoding('utf8')

sampleStream.on('readable', function(){
  console.log('I am readable');
  var chunk = sampleStream.read();
  console.log(chunk);
});

// sampleStream.pipe(process.stdout);
