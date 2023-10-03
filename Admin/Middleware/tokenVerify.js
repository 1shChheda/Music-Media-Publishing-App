const jwt = require("jsonwebtoken");
const logger = require("../../Utils/logger");

const tokenVerify = (req, res, next) => {
    const token = req.cookies.AAjwt;

    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    try {
        jwt.verify(token, process.env.ADMIN_JWT_SECRET, (error, decoded) => {
            if (error) {
                if (error.name != "TokenExpiredError") {
                    const RESPONSE = { message: "Invalid access token", error: error.message };
                    logger.writeLog(req, RESPONSE, "view", "admin");
                    return res.status(401).json(RESPONSE);
                }

                res.clearCookie("AAjwt");

                if (req.cookies?.ARjwt) {
                    const refreshToken = req.cookies.ARjwt;
                    jwt.verify(refreshToken, process.env.ADMIN_JWT_REFRESH_SECRET, (error, decoded) => {
                        if (error) {
                            res.clearCookie("ARjwt");
                            const RESPONSE = { message: "Invalid refresh token", error: error.message };
                            logger.writeLog(req, RESPONSE, "view", "admin");
                            return res.status(401).json(RESPONSE);
                        }
                        accessToken = jwt.sign(
                            { userID: decoded.userID, emailAddress: decoded.emailAddress },
                            process.env.ADMIN_JWT_SECRET,
                            { expiresIn: "120s" }
                        );
                        req.admin = decoded;
                        res.cookie("AAjwt", accessToken);

                        // console.log(accessToken);
                        next();
                    }
                    );
                } else {
                    const RESPONSE = { message: "Invalid refresh token" };
                    logger.writeLog(req, RESPONSE, "view", "admin");
                    return res.status(401).json(RESPONSE);
                }
            } else {
                req.admin = decoded;
                next();
            }
        });
    } catch (error) {
        const RESPONSE = { error: error.message };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(500).json(RESPONSE);
    }
};

module.exports = tokenVerify;