import dbconnect from "../../../../lib/dbconnect";
import Admin from "../../../../models/Admin";
import Student from "../../../../models/Student";

export default async function handler(req, res) {
  const { ipaddr, os, location, when, browser, role, userid } = req.body;
  await dbconnect();
  if (role === "Admin") {
    const exist = await Admin.find({
      _id: userid,
      "loginHistory.ipaddr": ipaddr,
      "loginHistory.os": os,
      "loginHistory.location": location,
      "loginHistory.browser": browser,
    });
    if (exist.length > 0) {
      const update = await Admin.updateOne(
        {
          _id: userid,
          "loginHistory.ipaddr": ipaddr,
          "loginHistory.os": os,
          "loginHistory.location": location,
          "loginHistory.browser": browser,
        },
        {
          $set: {
            "loginHistory.$.when": when,
          },
        }
      );
    } else {
      await Admin.findByIdAndUpdate(
        { _id: userid },
        {
          $push: {
            loginHistory: {
              $each: [
                {
                  ipaddr,
                  os,
                  location,
                  browser,
                  when,
                },
              ],
              $position: 0,
            },
          },
        }
      );
      return;
    }
  } else {
    const exist = await Student.find({
      _id: userid,
      "loginHistory.ipaddr": ipaddr,
      "loginHistory.os": os,
      "loginHistory.location": location,
      "loginHistory.browser": browser,
    });
    if (exist.length > 0) {
      await Student.updateOne(
        {
          _id: userid,
          "loginHistory.ipaddr": ipaddr,
          "loginHistory.os": os,
          "loginHistory.location": location,
          "loginHistory.browser": browser,
        },
        {
          $set: {
            "loginHistory.$.when": when,
          },
        }
      );
      return;
    } else if (role === "Student") {
      await Student.findByIdAndUpdate(
        { _id: userid },
        {
          $push: {
            loginHistory: {
              $each: [
                {
                  ipaddr,
                  os,
                  location,
                  browser,
                  when,
                },
              ],
              $position: 0,
            },
          },
        }
      );
      return;
    } else {
      return;
    }
  }
  res.status(200).json({ message: "OK" });
}
