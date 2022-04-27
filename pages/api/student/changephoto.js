import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { userphoto, studentid } = req.body;
  await Student.findByIdAndUpdate({ _id: studentid }, { userphoto });
  res.status(200).json({ message: "OK" });
}
