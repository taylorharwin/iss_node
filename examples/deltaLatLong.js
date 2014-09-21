//An implementation of SpaceStream that produces a transform stream, which pipes to process.stdout.
//The transform function adds two properties: change in longitude per second (deltaLat), and change in latitude per second (deltaLong).
//These are calculated based on the difference between each current response's coordinates and the coordinates of the response preceeding it.
//Time values are calculated using the timestamp property of each response object.
//The initial response in a new stream will be piped, and will have its deltaLat and deltaLong properties set to null.

var SpaceStream = require('../lib/index');
var util = require('util');
var Transform = require('stream').Transform;

function DeltaLatLong(){
  Transform.call(this);
  this._lastBlip = null;
}
  util.inherits(DeltaLatLong, Transform);

  DeltaLatLong.prototype._transform = function(chunk, encoding, done){
    var currentChunk = JSON.parse(chunk);
    var previousChunk = this.getComparitor();
    var modifiedChunk;
    var calculatedRates;
    var newPacket;

    if (previousChunk === null){
      modifiedChunk = {
        "name": currentChunk.name,
        "id": currentChunk.id,
        "deltaLat": null,
        "deltaLong": null
      };
    } else {

      calculatedRates = this.calculateRates(previousChunk, currentChunk);

      modifiedChunk = {
        "name": currentChunk.name,
        "id": currentChunk.id,
        "deltaLat": calculatedRates.dLat,
        "deltaLong": calculatedRates.dLong
      };
    }
    newPacket = JSON.stringify(modifiedChunk) +'\n';
    this.setComparitor(currentChunk);
    this.push(newPacket);

    done();

  };
  DeltaLatLong.prototype.setComparitor = function(obj){
    if (this._lastBlip === null){
      this._lastBlip = obj;
      return false;
    }
    this._lastBlip = obj;
    return this._lastBlip;
  };

  DeltaLatLong.prototype.getComparitor = function(){
    return this._lastBlip;
  };

  DeltaLatLong.prototype.calculateRates = function(obj1, obj2){
    if (!obj1 || !obj2 || !obj1.latitude || !obj1.longitude || !obj2.latitude || !obj2.longitude){
      throw new Error("The provided Satelite position objects were invalid");
    }
    var changeInLatitude = obj2.latitude - obj1.latitude;
    var changeInLongitude = obj2.longitude - obj1.longitude;
    var changeInTime = obj2.timestamp - obj1.timestamp;

    var dLat = (changeInLatitude / changeInTime);
    var dLong = (changeInLongitude / changeInTime);

    return {
      'dLat': dLat,
      'dLong': dLong
    };
  };

var originalStream = new SpaceStream(25544, 59);
var newStream = new DeltaLatLong();

originalStream.pipe(newStream).pipe(process.stdout);




