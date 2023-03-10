import { Types, Schema, model } from "mongoose";

const websiteSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    isActive: Boolean,
  },
  { timestamps: true }
);

export default model("Website", websiteSchema);
