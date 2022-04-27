import mongoose from "mongoose";

const RequestSchema = new mongoose.Schema({
  reason: String,
  requestId: mongoose.SchemaTypes.ObjectId,
  name: String,
  course: String,
  data: {
    year: Number,
    section: {
      type: String,
      maxlength: 1,
    },
  },
});

export default mongoose.models.Request ||
  mongoose.model("Request", RequestSchema);
