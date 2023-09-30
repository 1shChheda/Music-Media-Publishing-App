const jwt = require('jsonwebtoken')

// this is the type Authorization : Bearer <yourToken>
exports.tokenVerify = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token)
        const decoded = jwt.verify(token, 'secret')
        req.userData = decoded
        next();
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            error: error
        })
    }
}