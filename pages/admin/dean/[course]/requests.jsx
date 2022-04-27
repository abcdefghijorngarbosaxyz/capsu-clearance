import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import ScrollArea from "../../../../components/extras/ScrollArea";
import SideBarDean from "../../../../components/SideBar.Dean";
import TopBar from "../../../../components/TopBar";
import { useState } from "react";
import { CheckIcon, ThumbUpIcon, XCircleIcon } from "@heroicons/react/solid";

export default function Requests({ course, session, requests }) {
  const [list, setList] = useState(requests);

  const fetchList = async () => {
    const { data } = await axios.post("/api/admin/dean/requests", {
      course: course.short,
    });
    if (data) setList(data.list);
  };

  const handleAccept = async (name, reason, data, requestId, objectId) => {
    await axios.post("/api/admin/dean/requestsaction", {
      reason,
      name,
      data,
      requestId,
      objectId,
    });
    fetchList();
  };

  const handleDecline = async (objectId) => {
    await axios.post("/api/admin/dean/requestsaction", {
      reason: "delete",
      objectId,
    });
    fetchList();
  };

  const RequestList = ({ name, reason, data, index, requestId, objectId }) => {
    return (
      <>
        <div
          className={`flex h-16 items-center space-x-2 border-b py-2 px-4 text-sm font-semibold text-black ${
            index % 2 != 0 ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="w-1/2">{name}</div>
          <div className="w-32 font-normal">{reason}&nbsp;to</div>
          <div className="w-16">
            {reason.includes("year") ? data.year : data.section}
          </div>
          <div className="flex w-44 pl-2">
            <button
              onClick={() => {
                handleAccept(name, reason, data, requestId, objectId);
              }}
              className="flex items-center text-xs text-green-500 hover:text-green-600"
            >
              <CheckIcon className="h-5 w-5" />
              Accept
            </button>
            <button
              onClick={() => {
                handleDecline(objectId);
              }}
              className="ml-4 flex items-center text-xs text-red-500 hover:text-red-600"
            >
              <XCircleIcon className="h-5 w-5" />
              Decline
            </button>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex h-screen items-center justify-center p-4 lg:hidden">
        <h3 className="text-center text-5xl">
          Phone or tablet screen size NOT available for admin users.
        </h3>
      </div>
      <div className="hidden h-screen w-screen pt-20 lg:flex">
        <Head>
          <title>Requests | {course.short} - Dean&apos;s Office</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBarDean
            path={`/admin/dean/${session.department.toLowerCase()}/requests`}
            session={session}
            course={course}
          />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full p-8">
              <div className="prose prose-slate dark:prose-invert">
                <h1>Requests</h1>
              </div>
              <div className="mt-8 w-full rounded-lg bg-white shadow">
                <div className="mt-4 flex h-fit w-full space-x-2 rounded-t-lg bg-gray-100 py-2 px-4 text-xs font-semibold text-black">
                  <div className="w-1/2">
                    <h6>Name</h6>
                  </div>
                  <div className="w-32">
                    <h6>Reason</h6>
                  </div>
                  <div className="w-16">
                    <h6>Data</h6>
                  </div>
                </div>
                {list.length > 0 ? (
                  list.map((item, index) => (
                    <RequestList
                      key={index}
                      name={item.name}
                      reason={item.reason}
                      data={item.data}
                      index={index}
                      requestId={item.requestId}
                      objectId={item._id}
                    />
                  ))
                ) : (
                  <div className="text-md flex w-full justify-center pt-4 text-slate-500">
                    No new requests
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
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

  if (session) {
    const { role, department } = session;
    if (role === "Admin") {
      if (department.toLowerCase() === query.course) {
        var sessionCourse;
        for (var i in courses) {
          if (query.course === courses[i].short.toLowerCase())
            sessionCourse = courses[i];
        }
        const { data: requests } = await axios.post(
          host + "/api/admin/dean/requests",
          { course: sessionCourse.short }
        );
        return {
          props: {
            requests: requests.list,
            course: sessionCourse,
            session,
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
