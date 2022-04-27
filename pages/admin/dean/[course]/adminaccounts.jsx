import axios from "axios";
import { useState } from "react";

export default function AdminAccounts() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [department, setDepartment] = useState("");
  const [office, setOffice] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await axios.post("/api/admin/newadmin", {
      username,
      password,
      firstname,
      lastname,
      department,
      office,
    });
    if (data) console.log(data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          type="text"
          name="username"
          id="password"
          placeholder="username"
        />
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          name="password"
          id="password"
          placeholder="password"
        />
        <input
          value={firstname}
          onChange={(event) => setFirstname(event.target.value)}
          type="text"
          name="firstname"
          id="firstname"
          placeholder="firstname"
        />
        <input
          value={lastname}
          onChange={(event) => setLastname(event.target.value)}
          type="text"
          name="lastname"
          id="lastname"
          placeholder="lastname"
        />
        <input
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          type="text"
          name="department"
          id="department"
          placeholder="department"
        />
        <input
          value={office}
          onChange={(event) => setOffice(event.target.value)}
          type="text"
          name="office"
          id="office"
          placeholder="office"
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
}
