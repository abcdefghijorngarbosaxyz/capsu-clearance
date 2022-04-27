import dbconnect from "../../../lib/dbconnect";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { studentid } = req.body;
  await dbconnect();
  const user = await Student.findById(studentid);
  if (user) {
    res.status(200).json({ signature: user.signature });
  }
}
