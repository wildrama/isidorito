module.exports.isLoggedIn = (req, res, next) => {
    // console.log(req.user, 'req.user....');
    // console.log(req.session)

    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl  
        req.flash('error', ' Tiene que estar logeado antes');
        return res.redirect('/');
    }
    next();
}


module.exports.isAdmin = (role)=>{
   return (req, res, next) => {
        if ( req.user.funcion !== role) {
            req.flash('error', 'No se puede ingresar');
            return res.redirect(`/`);
        }
        next();
    }
    
    
} 

module.exports.isCaja = (role1)=>{
    return (req, res, next) => {
         if ( req.user.funcion !== role1) {
             req.flash('error', 'No se puede ingresar');
             return res.redirect(`/`);
         }
         next();
     }
     
     
 } 


