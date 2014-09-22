var assert = require("assert");
var SpaceStream = require('../lib/index.js');
var stream = require('stream');

describe('SpaceStream', function () {

    describe('identity', function () {
        var testerStream1 = new SpaceStream(25554, 59);

        it('should be a function', function () {
            assert.equal(typeof SpaceStream, 'function');
        });

        it('should be subclassed from stream.Readable', function () {
            assert.equal(testerStream1 instanceof stream.Readable, true);
        });
    });

    describe('userErrorCases', function () {
        it('should throw an error if no arguments are provided', function () {
            assert.throws(function () {
                var a = new SpaceStream();
            }, Error);
        });
        it('should throw an error if a non-number Sattelite ID is provided', function () {
            assert.throws(function () {
                var b = new SpaceStream('ISS', 30);
            }, Error);
        });
        it('should throw an error if a non-number frequency is provided', function () {
            assert.throws(function () {
                var c = new SpaceStream(255544, 'Often');
            }, Error);
        });

        it('should throw an error if an out-of-range frequency is provided', function () {
            assert.throws(function () {
                var d = new SpaceStream(255544, 61);
             }, Error);
        });
    });

    describe('expected data retrieval behavior', function () {
        this.timeout(2000);

        var receivedData = false;
        var e = new SpaceStream(25544, 55);
        e.setEncoding('utf8');

        it('should emit "readable" events when data is available to be read', function (done) {
            e.on('readable', function getData(){
                receivedData = e.read();
                e.removeListener('readable', getData);
                done();
                assert.ok(receivedData);
            });
        });
        it('should return JSON-stringified ISS location data from wheretheiss.at API', function(){
            receivedData = JSON.parse(receivedData);
            assert.equal(receivedData.name, 'iss');
        });
    });

    describe('timing', function(){

        it('should not receive data before data is expected', function(done){
            this.timeout(3000);

            var timesDataReceived = 0;
            var f = new SpaceStream(25544, 30);
            f.on('readable', function(){
                timesDataReceived++;
            });

            setTimeout(function(){
                assert.equal(timesDataReceived, 0);
                done();
            }, 1900);
        });

        it('should receive chunks within the user-described frequency, discounting I/O delay', function(done){
            this.timeout(3000);

            var timesDataReceived = 0;
            var g = new SpaceStream(25544, 59);
            g.on('readable', function(){
                timesDataReceived++;
            });

            setTimeout(function(){
                assert(timesDataReceived >= 1);
                done();
            }, 2000);
        });
    });
    describe('stream termination', function(){

        it('should have a stop method that emits an "end" event, stopping an active stream', function(){

            var ended = false;
            var h = new SpaceStream(25544, 30);
            h.on('end', function(){
                ended = true;
                assert(ended);
            });
            h.stopStream();
        });
    });
});
