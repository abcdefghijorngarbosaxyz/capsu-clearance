import dbconnect from "../../../../lib/dbconnect";
import Admin from "../../../../models/Admin";

export default async function handler(req, res) {
  const { email, adminid, action } = req.body;
  await dbconnect();
  if (action === "enable") {
    const data = await Admin.findOneAndUpdate(
      { _id: adminid },
      { "twofactor.email": email, "twofactor.enabled": true }
    );
    if (data.id) res.status(200).json({ message: "OK" });
  }
  if (action === "disable") {
    const data = await Admin.findOneAndUpdate(
      { _id: adminid },
      { "twofactor.email": email, "twofactor.enabled": false }
    );
    if (data.id) res.status(200).json({ message: "OK" });
  }
}
