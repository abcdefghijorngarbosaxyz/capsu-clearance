import Student from "../../../../models/Student";

export default async function handler(req, res) {
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
