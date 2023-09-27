const admin = require('../../Utils/firebaseAdmin');
const logger = require("../../Utils/logger");

const tokenVerify = async (req, res, next) => {
    try {
        // to get the firebase ID token from the request headers or body
        const token = req.headers.authorization || req.body.token;

        if (!token) {
            const RESPONSE = { error: "Unauthorized Access" };
            logger.writeLog(req, RESPONSE, "view", "user");
            return res.status(401).json(RESPONSE);
        }

        // to verify the firebase ID token
        const decodedToken = await admin.auth().verifyIdToken(token);
        logger.writeLog(req, decodedToken, "view", "user");
        console.log(decodedToken);
        req.uid = decodedToken.uid;

        next();
    } catch (error) {
        const RESPONSE = { error: `Token Verification Error: ${error}` };
        logger.writeLog(req, RESPONSE, "view", "user");
        return res.status(401).json(RESPONSE);
    }
};

module.exports = tokenVerify;