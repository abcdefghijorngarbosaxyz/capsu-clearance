import dbconnect from "../../../lib/dbconnect";
import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { signature, studentid } = req.body;
  await dbconnect();
  await Student.findByIdAndUpdate({ _id: studentid }, { signature });
  res.status(200).json({ message: "OK" });
}
