import dbconnect from "../../../lib/dbconnect";
import Admin from "../../../models/Admin";

export default async function handler(req, res) {
  const { userphoto, adminid } = req.body;
  await dbconnect();
  await Admin.findByIdAndUpdate({ _id: adminid }, { userphoto });
  res.status(200).json({ message: "OK" });
}
