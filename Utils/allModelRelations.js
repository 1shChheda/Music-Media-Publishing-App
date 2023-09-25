const Models = require("../Utils/allModels");
const sequelize = require("sequelize");

const modelRelations = () => {
    // user and country
    Models.userModel.belongsTo(Models.countryModel);
    Models.countryModel.hasMany(Models.userModel);

    // user and otp
    Models.userModel.hasOne(Models.userOtpModel);
    Models.userOtpModel.belongsTo(Models.userModel);

    // user and AddRelease1 (songs)
    Models.userModel.hasMany(Models.addRelease1Model); //1 user can have many songs and songs must belong->user
    Models.addRelease1Model.belongsTo(Models.userModel);

    // between AddRelease1 (songs) and assets
    Models.addRelease1Model.hasOne(Models.assetsModel); //each song has 1 asset and asset will belong to songs
    Models.assetsModel.belongsTo(Models.addRelease1Model);

    // between artists and songs
    // one song can have many artist and artist must belong to songs/user(can't decide)

    // user and userArtist (this is done, so that user can write the name of any other artist instead of himself, while adding the release)
    Models.userModel.hasMany(Models.userArtistModel);

    // userArtist and primaryArtist
    Models.userArtistModel.hasMany(Models.primaryArtistModel);
    Models.primaryArtistModel.belongsTo(Models.userArtistModel);

    // userArtist and featuringArtist
    Models.userArtistModel.hasMany(Models.featuringArtistModel);
    Models.featuringArtistModel.belongsTo(Models.userArtistModel);

    // addRelease1 and addRelease2
    Models.addRelease1Model.hasOne(Models.addRelease2Model);
    // Models.addRelease2Model.hasOne(Models.addRelease1Model);

    // addRelease2 and userArtist
    Models.addRelease2Model.hasOne(Models.userArtistModel);
    Models.userArtistModel.belongsTo(Models.addRelease2Model);

    // addRelease2 and primaryArtist
    Models.addRelease2Model.hasMany(Models.primaryArtistModel);
    Models.primaryArtistModel.belongsTo(Models.addRelease2Model);

    // addRelease2 and featuringArtist
    Models.addRelease2Model.hasMany(Models.featuringArtistModel);
    Models.featuringArtistModel.belongsTo(Models.addRelease2Model);
}

module.exports = modelRelations;