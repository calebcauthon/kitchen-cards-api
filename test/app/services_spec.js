"use strict";

describe("parseLine service", function () {
  var parseLine;

  beforeEach(function() {
    angular.mock.module('services');

    angular.mock.inject(function(_parseLine_) {
      parseLine = _parseLine_;
    });
  });

  it("should exist", function () {
    expect(parseLine).toBeDefined();
  });

  it("parses", function() {
    var result = parseLine("ADD 5 cups water");
    expect(result).toBeDefined();
  });

});