import Student from "../../../../models/Student";
import Period from "../../../../models/Period";

export default async function handler(req, res) {
  const period = await Period.findOne();
  const { schoolyear, semester, term } = period;
  const { studentid, signedby } = req.body;

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
          "status.$.status.affairs.signed": "Signed",
          "status.$.status.affairs.signedDate": new Date(),
          "status.$.status.affairs.signedBy": signedby,
        },
      }
    );
    res.status(200).json({ message: "Signed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
