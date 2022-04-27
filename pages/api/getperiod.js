import Period from "../../models/Period";
import dbconnect from "../../lib/dbconnect";

export default async function handler(req, res) {
  await dbconnect();
  const period = await Period.findOne();
  res.status(200).json({ period });
}
