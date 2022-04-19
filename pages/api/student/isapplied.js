import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { studentid } = req.body;

  try {
    const user = await Student.findById(studentid);
    res.status(200).json({ isApplied: user.applied.isApplied });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
