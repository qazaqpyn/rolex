let Collection = require('../models/collection');
let Watch = require('../models/watch');

let async = require('async');

//display all collections
exports.collection_list = function(req,res,next) {
    Collection.find({},'name')
        .exec(function(err, list_collection) {
            if(err) {next(err);}
            //success
            res.render('collection_list',{title:'Collection List', collection_list:list_collection});
        });
};

//display detail of particular collection
exports.collection_detail = function(req,res,next) {
    async.parallel({
        collection: function(callback) {
            Collection.findById(req.params.id)
                .exec(callback);
        },
        watch: function(callback){
            Watch.find({'category':req.params.id})
                .exec(callback);
        }
    }, function(err,results){
        if(err) {next(err);}
        if(results.collection==null) {
            let err = new Error('Collection not found');
            err.status = 404;
            return next(err);
        };
        //success
        res.render('collection_detail', {title: results.collection.name, category: results.collection, watches: results.watch});
    });
}

//display collection create
exports.collection_create_get = function(req,res) {
    res.send('not implemented');
};

//handle collection create post
exports.collection_create_post = function(req,res) {
    res.send('not implemented');
};

//display particular collection update
exports.collection_update_get = function(req,res) {
    res.send('not implemented');
};

//handle particular collection update post
exports.collection_update_post = function(req,res) {
    res.send('not implemented');
};

//display particular  collection delete
exports.collection_delete_get = function(req,res) {
    res.send('not implemented');
};

//handle particular collection delete post
exports.collection_delete_post = function(req,res){
    res.send('not implemented');
};