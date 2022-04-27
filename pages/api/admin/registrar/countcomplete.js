import axios from "axios";
import dbconnect from "../../../../lib/dbconnect";
import Period from "../../../../models/Period";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  const period = await Period.findOne();
  const schoolyear = period.schoolyear;
  const semester = period.semester;
  const term = period.term;
  await dbconnect();
  try {
    const completecount = await Student.find({
      "applied.isApplied": true,
      "status.schoolyear": schoolyear,
      "status.semester": semester,
      "status.term": term,
      "status.status.department.signed": "Signed",
      "status.status.library.signed": "Signed",
      "status.status.affairs.signed": "Signed",
      "status.status.collection.signed": "Signed",
      "status.status.registrar.signed": "Signed",
    }).count();
    res.status(200).json({ completecount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
