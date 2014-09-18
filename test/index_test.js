var assert = require("assert");
var SpaceStream = require('../index.js');
var stream = require('stream');

describe('SpaceStream', function(){


  describe('identity', function(){

    var testerStream1 = new SpaceStream(25554, 59);
    it('should be a function', function(){
      assert.equal(typeof SpaceStream, 'function');
    });

    it('should be subclassed from stream.Readable', function(){
      assert.equal(testerStream1 instanceof stream.Readable, true);
    });
  });

  describe('userErrorCases', function(){
    it ('should throw an error if no arguments are provided', function(){
      assert.throws(function(){
        var a = new SpaceStream();
    }, Error);
    });
    it ('should throw an error if a non-number Sattelite ID is provided', function(){
      assert.throws(function(){
        var b = new SpaceStream('ISS', 30);
      }, Error);
    });
    it ('should throw an error if a non-number frequency is provided', function(){
      assert.throws(function(){
        var c = new SpaceStream(255544, 'Often');
      }, Error);
    });
     it ('should throw an error if an out-of-range frequency is provided', function(){
      assert.throws(function(){
        var d = new SpaceStream(255544, 61);
      }, Error);
    });
  });







});