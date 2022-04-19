import Period from "../../models/Period";

export default async function handler(req, res) {
  const period = await Period.findOne();
  res.status(200).json({ period });
}
