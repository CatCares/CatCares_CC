const mongoose = require("mongoose");

const ringwormSchema = new mongoose.Schema(
    {
        image: {type: String},
        isRingworm: {type: Boolean},
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("ringworm", ringwormSchema);