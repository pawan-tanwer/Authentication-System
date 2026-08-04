const mongoose = require("mongoose");

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    token: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index:{
        expires:0
      }
    },
  },
  {
    timestamps: true,
  }
);

const refreshTokenModel= mongoose.model("RefreshToken", refreshTokenSchema);
module.exports = refreshTokenModel;