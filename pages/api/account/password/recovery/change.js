import dbconnect from "../../../../../lib/dbconnect";
import Student from "../../../../../models/Student";
import bcryptjs from "bcryptjs";

export default async function handler(req, res) {
  const { username, password2 } = req.body;
  await dbconnect();
  const password = await bcryptjs.hash(password2, await bcryptjs.genSalt());
  const response = await Student.findOneAndUpdate({ username }, { password });
  console.log(response);
  res.status(200).json({ message: "OK" });
}
