function authenticate(req, res, next) { 
    if (!req.session.userID) { 
        console.log("need to be logged in to see this content.");
        res.redirect('/login');
    } else { 
        next();
    }
}

module.exports = authenticate;