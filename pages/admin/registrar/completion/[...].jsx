import { getSession } from "next-auth/react";
import axios from "axios";
import TopBar from "../../../../components/TopBar";
import SideBar from "../../../../components/SideBar.Registrar";
import Head from "next/head";

export default function Completion({ session, period, endpoint, course }) {
  return (
    <>
      <div className="flex h-screen items-center justify-center p-4 lg:hidden">
        <h3 className="text-center text-5xl">
          Phone or tablet screen size NOT available for admin users.
        </h3>
      </div>
      <div className="hidden h-screen w-screen pt-20 lg:flex">
        <Head>
          <title>{course.name} - For Completion | Registrar</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBar path={`completion/${course.alt}`} session={session} />
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const courses = [
    { name: "Computer Science", short: "BSCS", alt: "computerscience" },
    { name: "Fisheries", short: "BSF", alt: "fisheries" },

    { name: "Elementary Education", short: "BEED", alt: "education" },
    { name: "Criminology", short: "BSCrim", alt: "criminology" },
    { name: "Food Technology", short: "BSFT", alt: "foodtech" },
  ];
  let course, inCourses;
  for (var i in courses) {
    if (req.url.includes(courses[i].alt)) {
      course = courses[i];
      inCourses = true;
    }
  }
  if (inCourses) {
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
            course,
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
  } else {
    return {
      notFound: true,
    };
  }
};
