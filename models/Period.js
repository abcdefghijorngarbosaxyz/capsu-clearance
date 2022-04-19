import mongoose from "mongoose";

const PeriodSchema = new mongoose.Schema({
  schoolyear: {
    type: Number,
    default: new Date().getFullYear(),
  },
  semester: {
    type: Number,
    default:
      new Date().getMonth() <= 4 ? 1 : new Date().getMonth() >= 7 ? 2 : 0,
    maxlength: 1,
  },
  term: {
    type: String,
    default: "Midterm",
  },
});

export default mongoose.models.Period || mongoose.model("Period", PeriodSchema);
