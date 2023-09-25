exports.allUserRoutes = (app) => {
    app.use(
        "/user",
        require("../Users/Routes/countryRoute"),
        require("../Users/Routes/authRoute"),
    );
}