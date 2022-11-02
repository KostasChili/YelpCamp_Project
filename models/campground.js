const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
url:String,
fileName:String
});


ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_400,h_300');
});

const CampgroundSchema = new Schema({
    title:{
        type:String
    },

    price:{
        type:Number

    },

    description:{
        type:String
    },

    location:{
        type:String
    },
    
    images:[ImageSchema],

    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]

});


CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews //remove all id's whose id is IN doc.reviews where doc is the campground that was deleted
            }
        })
    }
});

module.exports=mongoose.model('Campground',CampgroundSchema);

