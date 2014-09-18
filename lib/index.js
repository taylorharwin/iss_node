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

  this.on('transmissionComplete', function(coords){
    this.push(coords + '\n');
  });

  this.on('httpError', function(){
    this.push(null);
  });

  this.on('stopStream', function(){
    this.push(null);
  });

  this.openStream();
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

SpaceStream.prototype._read = function(data){
  // if (this._stop === true){
  //   this.push(null);
  // } else{
  //   dataStr = JSON.stringify(data);
  //   // var buf = new Buffer(dataStr, 'utf8');
  //   // this.push(buf);
  //   }
  };

SpaceStream.prototype.makeHTTPSRequest = function(){
  var self = this;

  var callback = function (res){

    var str = '';
    res.on('data', function(chunk){
      str += chunk;
    }).on('end', function(){
      self.emit('transmissionComplete', str);
    }).on('error', function(e){
      self.emit('httpError', e.message);
    });
  };
  
  return https.get(self.httpOptions, callback).end();
};

SpaceStream.prototype.toggleStream = function() {
  this.emit('stopStream');
};

SpaceStream.prototype.openStream = function() {
  var self = this;
  setInterval(function(){
    self.makeHTTPSRequest();
  }, self.userParams.freq);
};

 module.exports = SpaceStream;




