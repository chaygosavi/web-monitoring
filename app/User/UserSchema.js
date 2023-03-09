import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    tokens: {
      accessToken: {
        token: String,
        expiredAt: Date,
      },
      refreshToken: {
        token: String,
        expiredAt: Date,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default model("User", userSchema);
