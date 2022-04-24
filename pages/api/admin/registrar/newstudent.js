import dbconnect from "../../../../lib/dbconnect";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  const {
    username,
    password,
    firstname,
    middlename,
    lastname,
    department,
    yearlevel,
  } = req.body;

  await dbconnect();

  const newstudent = new Student({
    username,
    password,
    firstname,
    middlename,
    lastname,
    department,
    yearlevel,
  });

  try {
    const data = await newstudent.save();
    res.status(201).json({ message: "New student added", id: data._id });
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
}
