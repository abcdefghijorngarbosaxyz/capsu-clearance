import SideBar from "../../../components/SideBar.Registrar";
import Head from "next/head";
import TopBar from "../../../components/TopBar";
import { getSession } from "next-auth/react";
import axios from "axios";
import CircleProgressBar from "../../../components/extras/CircleProgressBar";

export default function RegistrarHome({
  session,
  appliedcount,
  allcount,
  completecount,
}) {
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
        <div className="h-full w-3/4 px-8">
          <div className="prose prose-slate py-8 dark:prose-invert">
            <h1>Dashboard</h1>
          </div>
          <div className="flex w-full space-x-4">
            <div className="flex h-fit w-1/2 space-x-8 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 p-4 shadow-lg">
              <CircleProgressBar
                progress={((appliedcount / allcount) * 100).toFixed(2)}
                size={180}
                strokeWidth={15}
                circleOneStroke="#fff"
                circleTwoStroke="#164e63"
              />
              <div className="prose-slate-700 prose">
                <h3 className="">Students applied</h3>
                <h1 className="text-7xl">
                  {appliedcount}/{allcount}
                </h1>
              </div>
            </div>
            <div className="flex h-fit w-1/2 space-x-8 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 p-4 shadow-lg">
              <CircleProgressBar
                progress={((completecount / allcount) * 100).toFixed(2)}
                size={180}
                strokeWidth={15}
                circleOneStroke="#fff"
                circleTwoStroke="#164e63"
              />
              <div className="prose-slate-700 prose">
                <h3 className="">Students completed</h3>
                <h1 className="text-7xl">
                  {completecount}/{allcount}
                </h1>
              </div>
            </div>
          </div>
        </div>
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
  const { data: applied } = await axios.get(
    host + "/api/admin/registrar/countapplied"
  );
  const { data: complete } = await axios.get(
    host + "/api/admin/registrar/countcomplete"
  );
  if (session) {
    const { role } = session;
    if (role === "Admin") {
      return {
        props: {
          session,
          completecount: complete.completecount,
          allcount: applied.allcount,
          appliedcount: applied.appliedcount,
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
