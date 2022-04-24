import Student from "../../../../models/Student";

export default async function handler(req, res) {
  const { studentid, semester, schoolyear, term } = req.body;

  try {
    await Student.findByIdAndUpdate(studentid, {
      $set: {
        "applied.isApplied": true,
      },
      $push: {
        status: {
          $each: [
            {
              schoolyear,
              semester,
              term,
            },
          ],
          $position: 0,
        },
      },
    });
    res
      .status(201)
      .json({ message: "Insert current semester status success!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
