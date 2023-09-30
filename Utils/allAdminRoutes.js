exports.allAdminRoutes = (app) => {
    app.use(
        "/admin",
        require("../Admin/Routes/authRoute"),
        require("../Admin/Routes/countryRoute"),
        require('../Admin/Routes/genreRoute'),
        require('../Admin/Routes/subGenreRoute'),
        require('../Admin/Routes/moodRoute'),
    );
}