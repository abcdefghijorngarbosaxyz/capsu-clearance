import dbconnect from "../../../lib/dbconnect";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { studentid } = req.body;
  await dbconnect();
  try {
    const user = await Student.findById(studentid);
    res.status(200).json({ isApproved: user.applied.isApproved });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
