module.exports=func=>{
    return(req,res,next)=>{
        func(req,res,next).catch(next);
    }
}

//this return a function that has func executed and then cathes any errors and passes them to next