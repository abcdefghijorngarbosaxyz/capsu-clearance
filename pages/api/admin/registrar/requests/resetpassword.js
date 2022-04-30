import dbconnect from "../../../../../lib/dbconnect";
import Student from "../../../../../models/Student";

export default async function handler(req, res) {
  await dbconnect();
  const list = await Student.find({ "reset.requested": true }).select({
    username: 1,
    firstname: 1,
    middlename: 1,
    lastname: 1,
    yearlevel: 1,
    department: 1,
    reset: 1,
    userphoto: 1,
  });
  res.status(200).json({ list });
}
