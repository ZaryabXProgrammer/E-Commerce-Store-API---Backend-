const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    const token = req.headers.token;

    // const token = authHeader.split(" ")[1];

    if (token) {
        try {
            const user = jwt.verify(token, process.env.JWT_SEC);

            if (user) {
                req.user = user; // Attach the user object to the request
                console.log(user)
                next();
            }
        } catch (err) {
            res.status(401).json('AccessToken is not valid');
        }
    } else {
        return res.status(401).json('User not authenticated');
    }
};

const verifyTokenAndAuthorization = (req, res, next) => {
    // const id = req.params.id;
    // const isAdmin = req.user.isAdmin; // Use req.user instead of req.verifiedUser
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('Not Allowed to Update');
        }
    })


};
const verifyTokenAndAdmin = (req, res, next) => {
    // const id = req.params.id;
    // const isAdmin = req.user.isAdmin; // Use req.user instead of req.verifiedUser
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(403).json('Not Allowed to Update');
        }
    })


};


module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
