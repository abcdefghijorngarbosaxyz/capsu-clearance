import SideBar from "../../../components/SideBar.Registrar";
import Head from "next/head";
import TopBar from "../../../components/TopBar";
import { getSession } from "next-auth/react";
import axios from "axios";

export default function RegistrarHome({ session, endpoint, period }) {
  return (
    <>
      <div className="flex h-screen items-center justify-center p-4 lg:hidden">
        <h3 className="text-center text-5xl">
          Phone or tablet screen size NOT available for admin users.
        </h3>
      </div>
      <div className="hidden h-screen w-screen pt-20 lg:flex">
        <Head>
          <title>Dashboard | Registrar</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBar path="/admin/registrar" session={session} />
        </div>
        <form method="post" action="/api/admin/registrar/newsemesterstatus">
          <input name="studentid" placeholder="Student ID"></input>
          <input name="schoolyear" placeholder="Schoolyear"></input>
          <input name="semester" placeholder="Semester"></input>
          <button type="submit">Submit</button>
        </form>
        <form method="post" action="/api/admin/registrar/approve">
          <input name="studentid" placeholder="Approved ID"></input>
          <button type="submit">Ok</button>
        </form>
      </div>
    </>
  );
}
export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  const host =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    `${process.env.HOSTNAME}`;
  const { data: period } = await axios.get(host + "/api/getperiod");
  if (session) {
    const { role } = session;
    if (role === "Admin") {
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
          period: period.period,
        },
      };
    } else if (role === "Student")
      return {
        redirect: {
          permanent: false,
          destination: "/student",
        },
      };
  }
  return {
    redirect: {
      permanent: false,
      destination: "/signin",
    },
  };
};
