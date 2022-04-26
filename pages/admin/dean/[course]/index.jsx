import React from "react";
import { getSession } from "next-auth/react";
import axios from "axios";
import CircleProgressBar from "../../../../components/extras/CircleProgressBar";
import Head from "next/head";
import TopBar from "../../../../components/TopBar";
import SideBarDean from "../../../../components/SideBar.Dean";

export default function Course({
  course,
  session,
  period,
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
          <title>Dashboard | {course.short} - Dean&apos;s Office</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBarDean
            path={`/admin/dean/${session.department.toLowerCase()}`}
            session={session}
            course={course}
          />
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
  const { req, query } = context;

  const courses = [
    { name: "Computer Science", short: "BSCS", alt: "computerscience" },
    { name: "Elementary Education", short: "BEED", alt: "education" },
    { name: "Fisheries", short: "BSF", alt: "fisheries" },
    { name: "Criminology", short: "BSCrim", alt: "criminology" },
    { name: "Food Technology", short: "BSFT", alt: "foodtech" },
  ];

  if (!courses.some((course) => course.short.toLowerCase() === query.course)) {
    return {
      notFound: true,
    };
  }
  const session = await getSession({ req });
  const host =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    `${process.env.HOSTNAME}`;
  const { data: period } = await axios.get(host + "/api/getperiod");

  if (session) {
    const { role, department } = session;
    const { data: count } = await axios.post(host + "/api/admin/dean/count", {
      course: department,
    });
    if (role === "Admin") {
      if (department.toLowerCase() === query.course) {
        var sessionCourse;
        for (var i in courses) {
          if (query.course === courses[i].short.toLowerCase())
            sessionCourse = courses[i];
        }
        return {
          props: {
            course: sessionCourse,
            period: period.period,
            session,
            appliedcount: count.appliedcount,
            completecount: count.completecount,
            allcount: count.allcount,
          },
        };
      } else {
        return {
          redirect: {
            permanent: false,
            destination: "/admin/dean/" + department.toLowerCase(),
          },
        };
      }
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
