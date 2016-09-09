var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://herogod:esposito@ds027896.mlab.com:27896/beardb'); // connect to our database
var Bear = require('./database/models/bear');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    console.log('Something is happening...');
    next();
});

router.get('/', function(req, res){
    res.json({message: 'hooray! welcome to our api!' });
});

router.route('/bears')
    .post(function(req, res){
        var bear = new Bear();
        bear.name = req.body.name;
        bear.save(function(err){
            if(err)
                res.send(err);
            
            res.json({message: 'Bear created!'});
        });
    })
    .get(function(req, res){
        Bear.find(function(err, bears){
            if(err)
                res.send(err);
            
            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if(err)
                res.send(err);
            
            res.json(bear);
        });
    })
    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if(err)
                res.send(err);
            
            bear.name = req.body.name;
            bear.save(function(err){
                if(err)
                    res.send(err);
                
                res.json({message: 'Bear updated!'});
            });
        });
    })
    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if(err)
                res.send(err);
            
            res.json({message: 'Sucessfully deleted' });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);