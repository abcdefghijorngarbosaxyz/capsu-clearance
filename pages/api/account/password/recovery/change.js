import dbconnect from "../../../../../lib/dbconnect";
import Student from "../../../../../models/Student";
import bcryptjs from "bcryptjs";
import TempLink from "../../../../../models/TempLink";

export default async function handler(req, res) {
  const { username, password2 } = req.body;
  await dbconnect();
  const password = await bcryptjs.hash(password2, await bcryptjs.genSalt());
  await Student.findOneAndUpdate({ username }, { password });
  await TempLink.findOneAndDelete({ username });
  res.status(200).json({ message: "OK" });
}
