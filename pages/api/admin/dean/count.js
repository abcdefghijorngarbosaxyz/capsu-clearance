import Student from "../../../../models/Student";
import Period from "../../../../models/Period";
import dbconnect from "../../../../lib/dbconnect";

export default async function handler(req, res) {
  const { course } = req.body;
  const period = await Period.findOne();
  const schoolyear = period.schoolyear;
  const semester = period.semester;
  const term = period.term;
  await dbconnect;
  try {
    const allcount = await Student.find({ department: course }).count();
    const appliedcount = await Student.find({
      "applied.isApplied": true,
      department: course,
    }).count();
    const completecount = await Student.find({
      "applied.isApplied": true,
      "status.schoolyear": schoolyear,
      "status.semester": semester,
      "status.term": term,
      department: course,
      "status.status.department.signed": "Signed",
      "status.status.library.signed": "Signed",
      "status.status.affairs.signed": "Signed",
      "status.status.collection.signed": "Signed",
      "status.status.registrar.signed": "Signed",
    }).count();
    res.status(200).json({ allcount, appliedcount, completecount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
