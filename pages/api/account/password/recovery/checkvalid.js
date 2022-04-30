import dbconnect from "../../../../../lib/dbconnect";
import TempLink from "../../../../../models/TempLink";

export default async function handler(req, res) {
  const { linkId } = req.body;
  await dbconnect();
  const check = await TempLink.findOne({ linkId });
  if (check) res.status(200).json({ valid: true, username: check.username });
  else res.status(200).json({ valid: false });
}
