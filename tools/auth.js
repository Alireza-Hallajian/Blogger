const AUTH = {
    check_session: check_session
    // is_login: signup_validator
}; 

const check_session = function (req, res, next) {  
    if (!req.session.user) return res.status(403).render('signin.ejs');

    next();
}


const is_login = function (req, res, next) {  
    if (req.session.user) { return res.redirect('/user/dashboard'); }
    
    next();
}




module.exports = AUTH;