let Watch = require('../models/watch');
let Collection = require('../models/collection');

let async = require('async');

const {body, validationResult} = require('express-validator');

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
exports.watch_detail = function(req,res, next) {
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
    Collection.find()
        .exec(function(err, collections) {
            if(err) {next(err);}

            res.render('watch_form',{title:'Create Watch', collections: collections})
        })
};

//handle watch create 
exports.watch_create_post = [
    body('name','Name of the Watch must be filled').trim().isLength({min:1}).escape(),
    body('description', 'Description of the Watch must be filled').trim().isLength({min:1}).escape(),
    body('reference_number','Every Watch must have reference number').trim().isNumeric().toInt().escape(),
    body('price','every Watch must have a price').trim().isNumeric().toInt().escape(),
    body('collection').escape(),

    (req,res,next) => {

        //extract all errors 
        const errors = validationResult(req);

        //create a Watch object 

        let watch = new Watch({
            name:req.body.name,
            description:req.body.description,
            category: req.body.collection,
            reference_number: req.body.reference_number,
            price: req.body.price
        });


        if(!errors.isEmpty()) {
            //there are some errors render form again with errors
            async.parallel({
                collection: function(callback) {
                    Collection.find(callback);
                },
            }, function(err,results) {
                if(err) {next(err);}

                res.render('watch_form', {title:'Create Watch', watch: watch, collections: results.collection, errors: errors.array()})
            })
        }
        
        //there are no erros, every data is ok
        else {
            watch.save(function(err) {
                if(err) {next(err);}

                //there are no errors and saved
                res.redirect(watch.url);

            });
        }
    }

];

//display particular watch update page
exports.watch_update_get = function(req,res) {
    async.parallel({
        watch: function(callback){
            Watch.findById(req.params.id).exec(callback);
        },
        collections: function(callback) {
            Collection.find().exec(callback);
        }
    }, function(err, results) {
        if(err) {next(err);}

        res.render('watch_form',{title:'Update Watch', watch:results.watch, collections: results.collections})
    })
};

//handle particular watch update post
exports.watch_update_post = [
    body('name','Name of the Watch must be filled').trim().isLength({min:1}).escape(),
    body('description', 'Description of the Watch must be filled').trim().isLength({min:1}).escape(),
    body('reference_number','Every Watch must have reference number').trim().isNumeric().toInt().escape(),
    body('price','every Watch must have a price').trim().isNumeric().toInt().escape(),
    body('collection').escape(),

    (req,res,next) => {
        console.log('we are posting');
        const errors = validationResult(req);

        let watch = new Watch({
            name: req.body.name,
            description: req.body.description,
            reference_number: req.body.reference_number,
            price: req.body.price,
            collection: req.body.collection,
            _id: req.params.id,
        });
        console.log('new watch is created')
        if(!errors.isEmpty()) {
            console.log('errors iin isempty');
            //there are some errors render form again with errors
            async.parallel({
                collection: function(callback) {
                    Collection.find(req.params.id).exec(callback);
                },
            }, function(err,results) {
                if(err) {next(err);}

                res.render('watch_form', {title:'Create Watch', watch: watch, collections: results.collection, errors: errors.array()})
            })
        } else {
            console.log('find and update');
            Watch.findByIdAndUpdate(req.params.id, watch, function updateWatch(err,thewatch) {
                if(err) {next(err);}

                res.redirect(thewatch.url);
            })
        }


    }
];

//display particular watch delete page
exports.watch_delete_get = function(req,res,next) {
    Watch.findById(req.params.id)
        .exec(function(err, watch) {
            if(err) {next(err);}

            //successful

            res.render('watch_delete',{title:'Delete Watch', watch:watch});
        })
};

//handle particular watch delete post
exports.watch_delete_post = function(req,res) {
    Watch.findById(req.body.watchid)
        .exec(function(err, watch) {
            if(err) {next(err);}
            //successful
            Watch.findByIdAndDelete(req.body.watchid, function deleteWatch(err){
                if(err) {
                    next(err);
                }
                //successful
                res.redirect('/catalog/watches')
            })
        })
};