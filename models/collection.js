let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CollectionSchema = new Schema({
    name: {type:String, required: true, maxLength: 100},
    description: {type:String, required: true}
});


//virtual for collection's url

CollectionSchema
    .virtual('url')
    .get(function(){
        return '/catalog/collection/' + this._id;
    });

module.exports = mongoose.model('Collection', CollectionSchema)