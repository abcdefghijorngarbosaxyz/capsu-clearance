import Period from "../../../../models/Period";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  const { schoolyear, semester, term, open } = req.body;
  if (open == true) {
    await Period.updateOne({ schoolyear, semester, term, open });
    await Student.updateMany(
      {},
      { "applied.isApplied": false, "applied.isApproved": false }
    );
    res.status(200).json({ message: "Open success" });
  } else await Period.updateOne({ open: false });
  res.status(200).json({ message: "Closed" });
}
