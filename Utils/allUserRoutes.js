exports.allUserRoutes = (app) => {
    app.use(
        "/user",
        require("../Users/Routes/countryRoute"),
        require("../Users/Routes/authRoute"),
        require('../Users/Routes/addRelease1Route'),
        require('../Users/Routes/addRelease2Route'),
        require('../Users/Routes/userArtistRoute'),
        require('../Users/Routes/genreRoute'),
        require('../Users/Routes/subGenreRoute'),
        require('../Users/Routes/moodRoute'),
    );
}