//An implementation of SpaceStream that produces a transform stream, which pipes to process.stdout.
//The transform function adds two properties: change in longitude per second, and change in latitude per second.
//These are calculated based on the difference between each current request's coordinates and the coordinates of the request before it.
//Time values are tracked using the timestamp property of each response object.

var SpaceStream = require('./index');
var util = require('util');
var Transform = require('stream').Transform;

function DeltaLatLong(){
  Transform.call(this);

  this._lastCall = null;
}

  util.inherits(DeltaLatLong, Transform);

  DeltaLatLong.prototype._transform = function(chunk, encoding, done){

    var oldChunk = JSON.parse(chunk);

    var modifiedChunk = {
      "name": oldChunk.name,
      "id": oldChunk.id,
      "latitude": oldChunk.latitude,
      "longitude": oldChunk.longitude
    };

    this.push(JSON.stringify(modifiedChunk));

    done();

  };
  DeltaLatLong.prototype.createComparitor = function(obj){
    this._lastCall = obj;
    return this._lastCall;
  };

var originalStream = new SpaceStream(25544, 59);
var newStream = new DeltaLatLong();

originalStream.pipe(newStream).pipe(process.stdout);
