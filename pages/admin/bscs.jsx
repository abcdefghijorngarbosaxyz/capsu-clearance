import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import axios from "axios";

const ENDPOINT = "http://localhost:5000";
var socket;

export default function ComputerHome() {
  socket = io(ENDPOINT);
  const [socketconnected, setSocketconnected] = useState(false);
  const [message, setMessage] = useState("");
  const [studentid, setStudentId] = useState("");
  const admindata = { office: "Department" };
  var userdata = { id: studentid };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    const { data } = await axios.post("/api/admin/sendnotification", {
      studentid,
      notificationOffice: admindata.office,
      notificationMessage: message,
    });
    if (data) socket.emit("notifications latest", userdata);
  };

  useEffect(() => {
    socket.on("connection", () => {
      setSocketconnected(true);
    });
  }, []);

  return (
    <>
      <div>Computer</div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          placeholder="Message"
          onChange={(event) => setMessage(event.target.value)}
        ></input>
        <input
          type="text"
          value={studentid}
          placeholder="Id"
          onChange={(event) => setStudentId(event.target.value)}
        ></input>
        <button type="submit">Send</button>
      </form>
      {studentid} ------- {message}
    </>
  );
}
