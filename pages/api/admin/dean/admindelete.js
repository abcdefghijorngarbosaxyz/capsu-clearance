import dbconnect from "../../../../lib/dbconnect";
import Admin from "../../../../models/Admin";

export default async function handler(req, res) {
  const { adminid } = req.body;
  await dbconnect();

  await Admin.findByIdAndDelete({ _id: adminid });
  res.status(200).json({ message: "OK" });
}
