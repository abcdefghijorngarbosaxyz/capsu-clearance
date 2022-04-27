import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { signature, studentid } = req.body;
  await Student.findByIdAndUpdate({ _id: studentid }, { signature });
  res.status(200).json({ message: "OK" });
}
