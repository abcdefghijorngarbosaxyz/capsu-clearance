import { getSession } from "next-auth/react";
import Head from "next/head";
import dbconnect from "../lib/dbconnect";
export default function Home() {
  return (
    <div>
      <Head>
        <title>Online Students&apos; Clearance System</title>
      </Head>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  // dbconnect - REMOVE ON PRODUCTION
  await dbconnect();
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  }
  if (session.role === "Student")
    return {
      redirect: {
        permanent: false,
        destination: "/student",
      },
    };
  else if (session.role === "Admin") {
    const goadmin = "/admin/" + session.department.toLowerCase();
    return {
      redirect: {
        permanent: false,
        destination: goadmin,
      },
    };
  }
};
