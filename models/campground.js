// SCHEMA SETUP
var travelSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
var Travel = mongoose.model("Travel", travelSchema);