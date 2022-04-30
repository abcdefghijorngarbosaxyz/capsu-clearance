import mongoose from "mongoose";

const TempLinkSchema = new mongoose.Schema({
  linkId: {
    type: String,
  },
  username: {
    type: String,
  },
  DateTime: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.models.TempLink ||
  mongoose.model("TempLink", TempLinkSchema);
