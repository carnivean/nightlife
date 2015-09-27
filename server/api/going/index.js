/**
 * Created by Erik Kynast on 27.09.2015.
 */
'use strict';

var express = require('express');
var controller = require('./going.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), controller.update);
router.patch('/:Id', auth.isAuthenticated(), controller.update);
router.delete('/', auth.hasRole('admin'), controller.destroyAll);
router.delete('/:id', controller.destroy);

module.exports = router;
