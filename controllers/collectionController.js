let Collection = require('../models/collection');
let Watch = require('../models/watch');

let async = require('async');

const {body, validationResult} = require('express-validator');

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

// TODO: problems was before with url of getting for ceerate



//display collection create
exports.collection_create_get = function(req,res) {
    res.render('collection_form',{title:'Create Collection'});
};

//handle collection create post
exports.collection_create_post = [ 
    //validate and sanitize the name and description fields
    body('name','Collection name is required').trim().isLength({min:1}).escape(),
    body('description', 'Collection description is required').trim().isLength({min:1}).escape(),
    //process request after validation adn sanitization
    (req,res,next) => {
        //extract the validation errors from request
        const errors = validationResult(req);

        //create new Collection object with cleaned data
        let collection = new Collection({
            name:req.body.name,
            description: req.body.description
        });

        if(!errors.isEmpty()) {
            //there are some errors. Render same page again with errors
            res.render('collection_form',{title:'Create Collection', collection:collection, errors: errors.array()});
            return;
        }
        else {
            //Data form is valid 
            //check if there is already existing object
            Collection.findOne({name:req.body.name})
                .exec(function(err,result) {
                    if(err) { return next(err);}

                    if(result) {
                        //collection exists
                        res.redirect(result.url);
                    }
                    else {
                        //doesn't exist
                        collection.save(function(err) {
                            if(err) { return next(err);}
                            res.redirect(collection.url);
                        });
                    }
                });
        }
    }
];

//display particular collection update
exports.collection_update_get = function(req,res) {
    Collection.findById(req.params.id)
        .exec(function(err, result) {
            if(err) {next(err);}
            res.render('collection_form',{title:'Update Collection', collection:result});
        })
};

//handle particular collection update post
exports.collection_update_post = [
    body('name','there must be name').trim().isLength({min:1}).escape(),
    body('description','there must be description').trim().isLength({min:1}).escape(),

    (req,res,next)=>{
        const errors = validationResult(req);

        let collection = new Collection({
            name: req.body.name,
            description: req.body.description,
            _id:req.params.id,
        });

        if(!errors.isEmpty()) {
            Collection.findById(req.params.id)
                .exec(function(err, result) {
                    if(err) {next(err);}
                    res.render('collection_form',{title:'Update Collection', collection:result, errors: errors.array()})
                    return;
                })
        } else {
            Collection.findByIdAndUpdate(req.params.id,collection,function updateCollection(err, theCollection) {
                if(err) {next(err);}

                res.redirect(theCollection.url);
            })
        }


    }
];

//display particular  collection delete
exports.collection_delete_get = function(req,res) {
    async.parallel({
        collection: function(callback) {
            Collection.findById(req.params.id).exec(callback);
        },
        collection_watches: function(callback) {
            Watch.find({"category":req.params.id}).exec(callback);
        }
    }, function(err,results){
        if(err) {next(err);}
        if(results.collection==null) {
            //no collections
            res.redirect('/catalog/collections');
        } 
        //successful
        res.render('collection_delete',{title:'Collection Delete', collection: results.collection, collection_watches: results.collection_watches});
    })
};

//handle particular collection delete post
exports.collection_delete_post = function(req,res){
    async.parallel({
        collection: function(callback) {
            Collection.findById(req.body.collectionid).exec(callback);
        },
        collection_watches: function(callback) {
            Watch.find({'category':req.body.collectionid}).exec(callback);
        }
    }, function(err, results) {
        if(err) {next(err);}

        //successfull
        if(results.collection_watches.length > 0) {
            //collection has watches, so we can't delete 
            res.render('collection_delete',{title:'Collection Delete', collection: results.collection, collection_watches: results.collection_watches});
            return;
        }
        //collection has no books, so delete and redirect
        Collection.findByIdAndDelete(req.body.collectionid, function deleteCollection(err) {
            if(err) {next(err);}
            //successful
            res.redirect('/catalog/collections');
        });

    })
};