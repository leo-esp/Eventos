var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
mongoose.connect('mongodb://herogod:esposito@ds027896.mlab.com:27896/beardb'); // connect to our database
var Bear = require('./database/models/bear');
var Extrato = require('./database/models/extrato');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening...');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bears')
    .post(function(req, res) {
        var bear = new Bear();
        bear.name = req.body.name;
        bear.noise = req.body.noise;
        bear.size = req.body.size;
        bear.color = req.body.color;

        req.assert('name', 'Nome é obrigatório').notEmpty();
        req.assert('size', 'O tamanho é obrigatório').notEmpty();
        req.assert('size', 'O tamanho precisa ser um número').isFloat();
        req.assert('color', 'A cor é obrigatória').notEmpty();

        var validatorErrors = req.validationErrors();
        if (validatorErrors) {
            res.format({
                json: function() {
                    res.status(400).json(validatorErrors);
                }
            });
        }

        bear.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: 'Bear created!' });
        });
    })
    .get(function(req, res) {
        Bear.find(function(err, bears) {
            if (err)
                res.send(err);
            res.format({
                html: function() {
                    res.render('bears', { data: bears });
                },
                json: function() {
                    res.json(bears);
                }
            });
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);

            res.json(bear);
        });
    })
    .put(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear) {
            if (err)
                res.send(err);

            bear.name = req.body.name;
            bear.noise = req.body.noise;
            bear.size = req.body.size;
            bear.color = req.body.color;
            bear.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Bear updated!' });
            });
        });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Sucessfully deleted' });
        });
    });

router.route('/financial')
    .get(function(req, res){
         Extrato.find(function(err, transactions) {
            if (err)
                res.send(err);
            res.format({
                html: function() {
                    res.render('extrato', { data: transactions });
                },
                json: function() {
                    res.json(transactions);
                }
            });
        });
    })
    .post(function(req, res){
        var extrato = new Extrato();
        extrato.value = req.body.value;
        extrato.mes = req.body.mes;

        extrato.save(function(err) {
            if (err)
                res.send(err);

            Extrato.find(function(err, transactions) {
                if (err)
                    res.send(err);
                res.format({
                    html: function() {
                        res.render('extrato', { data: transactions });
                    },
                    json: function() {
                        res.json(transactions);
                    }
                });
            });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);