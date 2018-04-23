const mongoose = require("mongoose");

mongoose.Promise = global.Promise;



mongoose.connect("mongodb://localhost:27017/RegApp")
    .then(() => { console.log("connection successful") })
    .catch((err) => console.log("connection NOT successfull", err))

module.exports = {
    mongoose
}

