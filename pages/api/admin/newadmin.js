import dbconnect from "../../../lib/dbconnect";
import Admin from "../../../models/Admin";

export default async function handler(req, res) {
  const { username, password, firstname, lastname, department, office } =
    req.body;

  await dbconnect();

  const newadmin = new Admin({
    username,
    password,
    firstname,
    lastname,
    department,
    office,
  });

  try {
    const data = await newadmin.save();
    res.status(201).json({ message: "New admin added", id: data._id });
  } catch (error) {
    res.status(400).json({ message: "Bad request" });
  }
}
