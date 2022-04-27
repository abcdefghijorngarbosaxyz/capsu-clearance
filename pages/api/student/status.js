import Student from "../../../models/Student";

export default async function handler(req, res) {
  const { studentid } = req.body;
  const user = await Student.findById(studentid);
  if (user.status[0]) {
    const clearance = user.status[0].status;
    console.log(clearance);
    res.status(200).json(clearance);
  }
}
