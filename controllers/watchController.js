let Watch = require('../models/watch');
let Collection = require('../models/collection');

let async = require('async');

//display home page
exports.index = function(req,res,next) {
    async.parallel({
        watch_count: function(callback) {
            Watch.countDocuments({},callback); //buildin function for models mongodb
        },
        collection_count: function(callback) {
            Collection.countDocuments({},callback);
        }
    },
    function(err, results){
        res.render('index', {title:"DataBase's Statistics", error:err, data:results});
    });
};

//dsiplay list of all watches
exports.watch_list = function(req,res,next) {
    Watch.find({},'name reference_number')
        .exec(function(err, list_watches) {
            if(err) { return next(err); }
            //success
            res.render('watch_list',{title:'Watch List', watch_list:list_watches});
        });
};

//display detail of particular watch
exports.watch_detail = function(req,res) {
    Watch.findById(req.params.id)
        .populate('category')
        .exec(function(err, result) {
            if(err) {next(err);}
            if(result == null) {
                let err = new Error('Watch not found');
                err.status=404;
                return next(err);
            }
            //success
            res.render('watch_detail', {title: result.name, watch:result})
        });
};

//display watch create
exports.watch_create_get = function(req,res) {
    res.send('not implemented');
};

//handle watch create 
exports.watch_create_post = function(req, res) {
    res.send('not implemented');
};

//display particular watch update page
exports.watch_update_get = function(req,res) {
    res.send('not implemented');
};

//handle particular watch update post
exports.watch_update_post = function(req,res) {
    res.send('not implemented');
};

//display particular watch delete page
exports.watch_delete_get = function(req,res) {
    res.send('not implemented');
};

//handle particular watch delete post
exports.watch_delte_post = function(req,res) {
    res.send('not implemented');
};