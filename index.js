var stream = require('stream');
var util = require('util');
var events = require('events');
var http = require('http');

var config = require('./config');

function SpaceStream(){
  stream.Readable.call(this);
  this._read = 16;
}

util.inherits(SpaceStream, stream.Readable);

SpaceStream.prototype.configureStream =  function(id, freq) {
    if (!id || isNaN(id)){
      throw new Error('id must be a NORAD satelite ID number. They are available at http://www.celestrak.com/pub/satcat.txt');
    }
   if (!freq || isNaN(freq) || freq >= 60 || freq <= 0){
      throw new Error('freq must be a number between 0 and 60, a value representing the number of requests to make each minute');
    }
    return {
      'url': config.remoteHost + config.remotePath + id,
      'freq': freq
    };
  },

SpaceStream.prototype.connectOverHTTP = function(options){
  var url = options.url;
  return http.get(url, function(res){
    console.log(res);
  }).on('error', function(e){
    console.log(e.message);
  });
},

SpaceStream.prototype.openStream = function(id, freq) {
    var spaceLink = createUrl(id);




}

 module.exports = new SpaceStream();




