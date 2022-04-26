import SideBarCLA from "../../../components/SideBar.CLA";
import Head from "next/head";
import TopBar from "../../../components/TopBar";
import { getSession } from "next-auth/react";

export default function AffairsHome({ session }) {
  return (
    <>
      <div className="flex h-screen items-center justify-center p-4 lg:hidden">
        <h3 className="text-center text-5xl">
          Phone or tablet screen size NOT available for admin users.
        </h3>
      </div>
      <div className="hidden h-screen w-screen pt-20 lg:flex">
        <Head>
          <title>Dashboard | Student {session.office}</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBarCLA path="/admin/affairs" session={session} />
        </div>
        <div className="h-full w-3/4 px-8">
          <div className="prose prose-slate py-8 dark:prose-invert">
            <h1>Dashboard</h1>
          </div>
          <div className="flex w-full space-x-4"></div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  if (session) {
    const { role, department } = session;
    if (role === "Admin" && department === "Affairs") {
      return {
        props: {
          session,
        },
      };
    } else if (role === "Student")
      return {
        redirect: {
          permanent: false,
          destination: "/student",
        },
      };
    else {
      return {
        redirect: {
          permanent: false,
          destination: "/",
        },
      };
    }
  }
  return {
    redirect: {
      permanent: false,
      destination: "/signin",
    },
  };
};
