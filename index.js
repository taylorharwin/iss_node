var stream = require('stream');
var util = require('util');
var events = require('events');
var http = require('http');
var config = require('./config');

function SpaceStream(id, freq){
  stream.Readable.call(this);

  this.options = this.configureStream(id, freq);
  this.readable = true;
  this._stop = false;
  this._read = function(data){
    if (this._stop === true){
      this.push(null);
    } else{
      this.push(data);
    }
  };
}

util.inherits(SpaceStream, stream.Readable);

SpaceStream.prototype.configureStream =  function(id, freq) {
  if (!id || isNaN(id)){
    throw new Error('id must be a NORAD satelite ID number. They are available at http://www.celestrak.com/pub/satcat.txt');
    }
  if (!freq || isNaN(freq) || freq >= 60 || freq <= 0){
    throw new Error('freq must be a number between 0 and 60, non-inclusive. It is the # of requests per minute to make');
    }
  return {
    'url': config.remoteHost + config.remotePath + '/' + id,
    'freq': freq * 1000
    };
  };

SpaceStream.prototype.makeHTTPGetRequest = function(url){
  var self = this;

  return http.get(url, function(res){
    this.push(res);
  }).on('error', function(e){
    console.log(e.message);
  });
};

SpaceStream.prototype.toggleStream = function() {
  this._stop = !this._stop;
};

SpaceStream.prototype.openStream = function() {
  var self = this;
  setInterval(function(){
    self.makeHTTPGetRequest(self.options.url);
  }, self.options.freq)
};


 module.exports = SpaceStream;




