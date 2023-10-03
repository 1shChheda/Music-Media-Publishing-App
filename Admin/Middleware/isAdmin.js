const allModels = require("../../Utils/allModels");

const isAdmin = async (req, res, next) => {
    const jwtEmail = req.admin.emailAddress;
    const admin = await allModels.adminModel.findOne({ where: { emailAddress: jwtEmail } });
    if (!admin) {
        req.is_admin_exist = false;
        const RESPONSE = { message: "Unauthorized: Admin not found" };
        logger.writeLog(req, RESPONSE, "view", "admin");
        return res.status(401).json(RESPONSE);
    } else {
        req.is_admin_exist = true;
        next();
    }
};

module.exports = isAdmin;