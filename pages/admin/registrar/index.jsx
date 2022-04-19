import SideBar from "../../../components/SideBar.Registrar";
import Head from "next/head";
import TopBar from "../../../components/TopBar";

export default function RegistrarHome() {
  return (
    <div className="flex h-screen w-screen pt-20">
      <Head>
        <title>Dashboard | Registrar</title>
      </Head>
      <TopBar />
      <div className="h-full w-1/4">
        <SideBar />
      </div>
      <form method="post" action="/api/admin/registrar/newsemesterstatus">
        <input name="studentid" placeholder="Student ID"></input>
        <input name="schoolyear" placeholder="Schoolyear"></input>
        <input name="semester" placeholder="Semester"></input>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
