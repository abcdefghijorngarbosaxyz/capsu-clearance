import dbconnect from "../../../../lib/dbconnect";
import Admin from "../../../../models/Admin";

export default async function handler(req, res) {
  const { adminid } = req.body;
  await dbconnect();
  const admin = await Admin.findById({ _id: adminid }).select({ twofactor: 1 });
  res.status(200).json({ twofactor: admin.twofactor });
}
