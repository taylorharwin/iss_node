var assert = require("assert");
var SpaceStream = require('../index.js');
var stream = require('stream');

describe('SpaceStream', function(){


  describe('identity', function(){

    var testerStream = new SpaceStream(25554, 59);
    it('should be a function', function(){
      assert.equal(typeof SpaceStream, 'function');
    });

    it('should be subclassed from stream.Readable', function(){
      assert.equal(testerStream instanceof stream.Readable, true);
    });
  });







});