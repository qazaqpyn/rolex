let express = require('express');
let router = express.Router();

//require controllers
let watch_controller = require('../controllers/watchController');
let collection_controller = require('../controllers/collectionController');

//list of all routes

//get catalog home page
router.get('/',watch_controller.index);

//WATCH ROUTES

// get watches list
router.get('/watches', watch_controller.watch_list);

//get watch detail
router.get('/watch/:id', watch_controller.watch_detail);

//get create watch
router.get('/watches/create',watch_controller.watch_create_get);

//post create watch
router.post('/watches/create',watch_controller.watch_create_post);

//get id update
router.get('/watch/:id/update',watch_controller.watch_update_get);

//post id update
router.post('/watch/:id/update',watch_controller.watch_update_post);

//get id delete
router.get('/watch/:id/delete', watch_controller.watch_delete_get);

//post id delete
router.post('/watch/:id/delete', watch_controller.watch_delete_post);


//COLLECTION ROUTE

//get list of collections
router.get('/collections', collection_controller.collection_list);

//get id collection detail
router.get('/collection/:id', collection_controller.collection_detail);

//get create collection
router.get('/collections/create', collection_controller.collection_create_get);

//post create collection
router.post('/collections/create', collection_controller.collection_create_post);

//get id collection update
router.get('/collection/:id/update', collection_controller.collection_update_get);

//post id collection update
router.post('/collection/:id/update', collection_controller.collection_update_post);

//get id collection delete
router.get('/collection/:id/delete', collection_controller.collection_delete_get);

//post id collection delete
router.post('/collection/:id/delete', collection_controller.collection_delete_post);


module.exports = router;

