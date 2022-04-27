import Student from "../../../../models/Student";
import Period from "../../../../models/Period";
import dbconnect from "../../../../lib/dbconnect";

export default async function handler(req, res) {
  const period = await Period.findOne();
  const { schoolyear, semester, term } = period;
  const { studentid, signedby } = req.body;
  await dbconnect();
  try {
    await Student.updateOne(
      {
        _id: studentid,
        "status.schoolyear": schoolyear,
        "status.semester": semester,
        "status.term": term,
      },
      {
        $set: {
          "status.$.status.department.signed": "Signed",
          "status.$.status.department.signedDate": new Date(),
          "status.$.status.department.signedBy": signedby,
        },
      }
    );
    res.status(200).json({ message: "Signed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
