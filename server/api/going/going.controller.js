/**
 * Created by Erik Kynast on 27.09.2015.
 */
/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /things              ->  index
 * POST    /things              ->  create
 * GET     /things/:id          ->  show
 * PUT     /things/:id          ->  update
 * DELETE  /things/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var Going = require('./going.model');

// Get list of things
exports.index = function (req, res) {
  Going.find(function (err, docs) {
    if (err) {
      return handleError(res, err);
    }
    return res.status(200).json(docs);
  });
};

exports.update = function (req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Going.findById(req.params.id, function (err, doc) {
    if (err) {
      return handleError(res, err);
    }
    if (!doc) {
      return res.status(404).send('Not Found');
    }
    var updated = _.extend(doc, req.body);
    updated.save(function (err) {
      console.log("saving updated doc... I hope so...");
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(doc);
    });
  });
};

// Deletes a thing from the DB.
exports.destroy = function (req, res) {
  Going.findById(req.params.id, function (err, doc) {
    if (err) {
      return handleError(res, err);
    }
    if (!doc) {
      return res.status(404).send('Not Found');
    }
    doc.remove(function (err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};


exports.create = function (req, res) {
  Going.create(req.body, function (err, doc) {
    if (err) {
      return handleError(res, err);
    }
    doc.save();
    return res.status(201).json(doc);
  });
};

exports.destroyAll = function(req, res) {
  Going.remove({}, function(err) {
    if(err) {
      handleError(res, err);
    }
    return res.status(204).send('No Content');
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
