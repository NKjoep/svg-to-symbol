'use strict';
var express = require('express');
var router = express.Router();
var SVGSpriter = require('svg-sprite');

var config = {
  'log': 'verbose',
  'mode': {
    'symbol': {
      'bust': false,
      'inline': true,
      'example': true
    }
  }
};

router.options('/convert-to-symbol', function(req, res) {
  res.status(200).send();
});

router.post('/convert-to-symbol', function(req, res) {
  var spriter = new SVGSpriter(config);
  var name = `svg-${Math.random()}.svg`;
  spriter.add(`./${name}`, `${name}`, req.body.svgData);
  spriter.compile(function(error, result) {
    if (error) {
      res.status(503).send(error);
      return;
    }
    var data = result.symbol.sprite._contents.toString();
    data = data
      .replace(/></g, '>\n<')
      .replace(/id=""/g, '')
      .replace(/\s{2,}/gm, '')
      .replace(/"(?:\s{1,})/gm, '" ');
    res.type('json').status(200).send({
      symbol: data,
      input: req.body.svgData
    });
  });
});

module.exports = router;
