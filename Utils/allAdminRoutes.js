exports.allAdminRoutes = (app) => {
    app.use(
        "/admin",
        require("../Admin/Routes/authRoute"),
    );
}