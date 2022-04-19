import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { studentid } = req.body;

  try {
    await Student.updateOne(
      { _id: studentid },
      { $set: { "applied.isApplied": true, "applied.appliedDate": new Date() } }
    );
    res.status(200).json({ message: "Applied" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
