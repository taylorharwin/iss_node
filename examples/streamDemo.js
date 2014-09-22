// This is a basic example of consuming a readable SpaceStream. Rather than hooking into 'readable' events, you could also pipe to a writeable stream:
//e.g., replace lines 7-10 with sampleStream.pipe(process.stdout);


var SpaceStream = require('../lib/index');

var sampleStream = new SpaceStream(25544, 30);

sampleStream.setEncoding('utf8');

sampleStream.on('readable', function(){

  var chunk = sampleStream.read();
  if (chunk !== null){
    console.log(chunk);
  }
});

