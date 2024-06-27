function authenticate(req, res, next) { 
    if (!req.session.userID) { 
        console.log("need to be logged in to see this content.");
        res.status(401).send("Log in to view content");
        return;
    } else { 
        next();
    }
}

module.exports = authenticate;