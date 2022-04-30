import dbconnect from "../../../../../lib/dbconnect";
import Student from "../../../../../models/Student";
import TempLink from "../../../../../models/TempLink";

export default async function handler(req, res) {
  await dbconnect();
  const { username, linkId } = req.body;
  const newTempLink = new TempLink({ linkId, username });
  await newTempLink.save();
  await Student.findOneAndUpdate({ username }, { reset: {} });
  res.status(200).json({ message: "OK" });
}
