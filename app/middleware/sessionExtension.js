function extendSession(req, res, next) { 
    if (req.session) {
        req.session.touch();
    } else { 
        next();
    }
}
module.exports = extendSession;