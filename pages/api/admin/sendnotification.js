import Student from "../../../models/Student";

export default async function handler(req, res) {
  const {
    studentid,
    notificationMessage,
    sender,
    userphoto,
    notificationOffice,
  } = req.body;

  try {
    await Student.findByIdAndUpdate(studentid, {
      $push: {
        notifications: {
          $each: [
            {
              notificationOffice: notificationOffice,
              notificationMessage: notificationMessage,
              notificationDate: new Date(),
              notificationBy: sender,
              notificationPhoto: userphoto,
            },
          ],
          $position: 0,
        },
      },
    });
    res.status(201).json({ message: "Sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
}
