const isLogin=async(req,res,next)=>{
    try{
        if(req.session.user){
            
        }else{
            return res.redirect("/UserLogin");
        }
        next()
    }catch(error){
        console.log(error.message)
    }
    }
    
    const isLogout=async(req,res,next)=>{
        try{
    if(req.session.user){
     return res.redirect("/UserLogin");
    
    }
    next();
        }catch(error){
      console.log(error.message);      
        }
    }
    module.exports={
        isLogin,
        isLogout
    }