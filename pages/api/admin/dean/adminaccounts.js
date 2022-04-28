import dbconnect from "../../../../lib/dbconnect";
import Admin from "../../../../models/Admin";

export default async function handler(req, res) {
  const { department } = req.body;
  await dbconnect();
  const list = await Admin.find({ department: department });
  res.status(200).json({ list });
}
