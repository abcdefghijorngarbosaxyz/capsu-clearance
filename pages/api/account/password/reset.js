import dbconnect from "../../../../lib/dbconnect";
import Student from "../../../../models/Student";
import RandExp from "randexp";
import TempLink from "../../../../models/TempLink";

export default async function handler(req, res) {
  const { username, email, proof } = req.body;
  await dbconnect();
  var linkId = new RandExp(/[a-zA-Z\d]{16}/).gen();
  await Student.findOneAndUpdate(
    { username },
    {
      "reset.requested": true,
      "reset.proof": proof,
      "reset.email": email,
      "reset.linkId": linkId,
    }
  );
  res.status(200).json({ message: "OK" });
}
