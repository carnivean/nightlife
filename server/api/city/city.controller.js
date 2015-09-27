/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /Citys              ->  index
 * POST    /Citys              ->  create
 * GET     /Citys/:id          ->  show
 * PUT     /Citys/:id          ->  update
 * DELETE  /Citys/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var City = require('./city.model');

// Get list of Citys
exports.index = function(req, res) {
    var resp = {
      'name': 'Berlin',
      'bar': 'TestBar'
    };
    return res.status(200).json(resp);
};

// Get a single City
exports.show = function(req, res) {
  City.findById(req.params.id, function (err, City) {
    if(err) { return handleError(res, err); }
    if(!City) { return res.status(404).send('Not Found'); }
    return res.json(City);
  });
};

// Creates a new City in the DB.
exports.create = function(req, res) {
  City.create(req.body, function(err, City) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(City);
  });
};

// Updates an existing City in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  City.findById(req.params.id, function (err, City) {
    if (err) { return handleError(res, err); }
    if(!City) { return res.status(404).send('Not Found'); }
    var updated = _.merge(City, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(City);
    });
  });
};

// Deletes a City from the DB.
exports.destroy = function(req, res) {
  City.findById(req.params.id, function (err, City) {
    if(err) { return handleError(res, err); }
    if(!City) { return res.status(404).send('Not Found'); }
    City.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
