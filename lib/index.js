var stream = require('stream');
var util = require('util');
var events = require('events');
var https = require('https');
var config = require('./config');

function SpaceStream(id, freq){
  stream.Readable.call(this);
  this.userParams = this.configureStream(id, freq);

  this.httpOptions = {
    hostname: config.remoteHost,
    path: config.remotePath + '/' + this.userParams.id,
    rejectUnauthorized: false
  };
  this.readable = true;
  this.stopped = false;
}

util.inherits(SpaceStream, stream.Readable);

SpaceStream.prototype.configureStream =  function(id, freq) {
  if (!id || isNaN(id)){
    throw new Error('id must be a NORAD satelite ID number. They are available at http://www.celestrak.com/pub/satcat.txt');
    }
  if (!freq || isNaN(freq) || freq >= 60 || freq <= 0){
    throw new Error('freq must be a number between 0 and 60, non-inclusive. It is the # of requests to make per minute, i.e., freq: 2 means 1 request every 30000ms');
    }
  return {
    'id': id,
    'freq': 60000/freq
    };
  };

SpaceStream.prototype._read = function(){
  if (!this.stopped){
    var self = this;
    setTimeout(function(){
      self.makeHTTPSRequest();
      }, self.userParams.freq);
  } else {
    this.emit('end');
    this.push(null);
    }
  };

SpaceStream.prototype.makeHTTPSRequest = function(){
  var self = this;

  function callback(res){
    var str = '';
    res.on('data', function(chunk){
      str += chunk;
    }).on('end', function(){
      self.push(str + '\n');
    }).on('error', function(e){
      console.log(e.message);
      self.push(null);
    });
  }
  
  return https.get(this.httpOptions, callback);
};

SpaceStream.prototype.stopStream = function() {
  this.stopped = true;
};

module.exports = SpaceStream;




