import dbconnect from "../../../../lib/dbconnect";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  await dbconnect();

  const list = await Student.find();
  console.log(list);
  res.status(200).json({ students: list });
}
