const jwt = require('jsonwebtoken');

const createToken = function(auth) {
    return jwt.sign({
            id: auth.id
        }, 'my-secret',
        {
            expiresIn: 60 * 120
        });
};

module.exports = {
    generateToken: function(req, res, next) {
        req.token = createToken(req.auth);
        return next();
    },
    sendToken: function(req, res) {
        res.setHeader('x-auth-token', req.token);
        let dataToReturn;
        if (req.user.rows[0] === undefined) {
            dataToReturn = {};
        } else {
            dataToReturn = req.user.rows[0];
        }
        dataToReturn.permissionType = req.user.permissionType;
        return res.status(200).send(JSON.stringify(dataToReturn));
    }
};