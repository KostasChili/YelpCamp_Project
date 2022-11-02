const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary/index');
const campground = require('../models/campground');

module.exports.index =  async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs', { campgrounds});
};


module.exports.newRenderForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.new = async(req,res)=>{
    const campground = new Campground(req.body.campground);
    campground.images=req.files.map(f=>({url:f.path, fileName:f.filename}));
    campground.author=req.user._id;
    await campground.save();
    req.flash('success',`campground ${campground.title} was creted successfully`);
    res.redirect(`/campgrounds/${campground._id}`);
    
}

module.exports.show =  async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author');
    if(!campground)
    {
        req.flash('error','cannot find campground')
        res.redirect('/campgrounds')
    }
    else
    res.render('campgrounds/show', { campground });
}

module.exports.editRenderForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
   if(!campground)
   {
    req.flash('error',"Cannot find Campground");
    return res.redirect("/campgrounds");
   }
   res.render('campgrounds/edit.ejs',{campground});

}

module.exports.edit =  async (req, res) => {
    const {id} = req.params;
    const campground =  await Campground.findByIdAndUpdate(id,{...req.body.campground});
    const imgs =req.files.map(f=>({url:f.path, fileName:f.filename}));
    campground.images.push(...imgs);
    if(req.body.deleteImages)
    {
        for(let fileName of req.body.deleteImages){
            await cloudinary.uploader.destroy(fileName);
        }
      await campground.updateOne({$pull:{images:{fileName:{$in:req.body.deleteImages}}}});

    }
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}

module.exports.delete = async(req,res)=>{
    const {id}=req.params;
    const campground = await Campground.findById(id);
    for(let img of campground.images)
    {
        await cloudinary.uploader.destroy(img.fileName);
    }
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted Campground');
    res.redirect('/campgrounds');
}