const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // This will be the email
  name: String,
  googleId: String
});

// This line connects the plugin to the schema
userSchema.plugin(passportLocalMongoose); 
userSchema.plugin(findOrCreate);
module.exports = mongoose.model("User", userSchema);