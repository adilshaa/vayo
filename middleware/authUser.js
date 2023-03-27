const isLogin=async(req,res,next)=>{
    try{
        if(req.session.user){
            
        }else{
            return res.redirect('/Home')
        }
        next()
    }catch(error){
        console.log(error.message)
    }
    }
    
    const isLogout=async(req,res,next)=>{
        try{
    if(req.session.user){
     return res.redirect('/Home')
    
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