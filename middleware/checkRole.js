module.exports={
    isAdmin:(req,res,next)=>{
        if(req.isAuthenticated() && req.user.role=='admin'){
            return next();
        }
        res.status(403).render('unauthorized'); // Create this view for unauthorized access
    },
    isUser: (req, res, next) => {
        if (req.isAuthenticated() && req.user.role === 'buyer') {
          return next();
        }
        res.status(403).render('unauthorized');
    }
}