import dbconnect from "../../../../lib/dbconnect";
import Request from "../../../../models/Request";

export default async function handler(req, res) {
  await dbconnect();
  const { course } = req.body;
  const list = await Request.find({ course: course });
  res.status(200).json({ list });
}
