let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let WatchSchema = new Schema(
    {
        name: {type: String, required:true, maxLength:100},
        description: {type: String, required: true },
        category: {type: Schema.Types.ObjectId, ref: 'Collection', required: true},
        reference_number: {type:Number, required: true},
        price: {type:Number, required: true}
    }
);

//virtual for watch's URL

WatchSchema
    .virtual('url')
    .get(function(){
        return '/catalog/watch/' + this._id;
    });




//export model

module.exports = mongoose.model('Watch', WatchSchema);