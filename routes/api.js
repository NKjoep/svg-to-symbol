var express = require('express');
var router = express.Router();
var SVGSpriter = require('svg-sprite');
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var config = {
    "log": "verbose",
    "mode": {
        "symbol": {
            "bust": false,
            "inline": true,
            "example": true
        }
    }
};

router.options('/convert-to-symbol', function(req, res, next) {
    res.status(200).send();
})

router.post('/convert-to-symbol', function(req, res, next) {
    var spriter = new SVGSpriter(config);
    spriter.add('svg', null, req.body.svgData);
    spriter.compile(function(error, result) {
        if (error) {
            res.status(503).send(error);
            return;
        }
        res.type('json');
        var data = result.symbol.sprite._contents.toString();
        data = data
          .replace(`<symbol viewBox`, `<symbol id="symbol" viewBox`)
          .replace(/\>\</g, '>\n<')
          .replace('/id=""/g', '');
        data.re
        res.status(200).send({data: data});
    });
});

module.exports = router;
