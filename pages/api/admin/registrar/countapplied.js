import Student from "../../../../models/Student";
import dbconnect from "../../../../lib/dbconnect";

export default async function handler(req, res) {
  await dbconnect();
  try {
    const allcount = await Student.count();
    const appliedcount = await Student.find({
      "applied.isApplied": true,
    }).count();
    res.status(200).json({ allcount, appliedcount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
