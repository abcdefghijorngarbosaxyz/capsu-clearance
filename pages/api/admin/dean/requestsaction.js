import dbconnect from "../../../../lib/dbconnect";
import Request from "../../../../models/Request";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  await dbconnect();
  const { reason, name, requestId, data, objectId } = req.body;
  if (reason.includes("year")) {
    const request = await Student.findByIdAndUpdate(
      { _id: requestId },
      { yearlevel: data.year }
    );
    if (request) {
      await Request.findByIdAndDelete({ _id: objectId });
    }
  } else if (reason.includes("section")) {
    const request = await Student.findByIdAndUpdate(
      { _id: requestId },
      { section: data.section }
    );
    if (request) {
      await Request.findByIdAndDelete({ _id: objectId });
    }
  } else if (reason.includes("delete")) {
    await Request.findByIdAndDelete({ _id: objectId });
  }
  res.status(200).json({ message: "OK" });
}
