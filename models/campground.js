const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
//mongoose by default does not return the virtuals of the model
const opts = {toJSON:{virtuals:true}};

const ImageSchema = new Schema({
url:String,
fileName:String
});


ImageSchema.virtual('thumbnail').get(function(){
   return this.url.replace('/upload','/upload/w_300,h_200');
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
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        },
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

},opts);


//return the markup text for mapbox cluster map
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0,20)}...</p>`
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

0