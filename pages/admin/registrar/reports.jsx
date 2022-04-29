import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import ScrollArea from "../../../components/extras/ScrollArea";
import SideBar from "../../../components/SideBar.Registrar";
import TopBar from "../../../components/TopBar";
import { useState, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@heroicons/react/outline";
import Image from "next/image";

export default function Reports({ session, students }) {
  const handleBack = () => {
    setSkip(skip - 10);
    setLimit(limit - 10);
  };
  const handleNext = () => {
    setSkip(skip + 10);
    setLimit(limit + 10);
  };
  const [studentIDQuery, setStudentIDQuery] = useState("");
  const [lastNamesQuery, setLastNamesQuery] = useState("");
  const [firstNamesQuery, setFirstNamesQuery] = useState("");
  const [yearLevelsQuery, setYearlevelsQuery] = useState(0);
  const [coursesQuery, setCoursesQuery] = useState("");

  const [list, setList] = useState(students);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  const filterFirstNames = list.filter((list) =>
    list.firstname
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(firstNamesQuery.toLowerCase().replace(/\s+/g, ""))
  );

  const filterLastNames = list.filter((list) =>
    list.lastname
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(lastNamesQuery.toLowerCase().replace(/\s+/g, ""))
  );

  const filterYearLevels = list.filter(
    (list) => list.yearlevel == yearLevelsQuery
  );

  const filterStudentIDs = list.filter((list) =>
    list.username
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(studentIDQuery.toLowerCase().replace(/\s+/g, ""))
  );

  const filterCourses = list.filter((list) =>
    list.department
      .toLowerCase()
      .replace(/\s+/g, "")
      .includes(coursesQuery.toLowerCase().replace(/\s+/g, ""))
  );
  const ListRow = ({
    id,
    studentid,
    photo,
    last,
    first,
    middle,
    year,
    index,
    applied,
    course,
  }) => {
    return (
      <div
        className={`flex h-16 items-center space-x-2 border-b py-2 px-4 text-sm font-semibold text-black ${
          index % 2 != 0 ? "bg-gray-100" : "bg-white"
        }`}
      >
        <div className="w-14">
          {photo ? (
            <div className="relative h-10 w-10 rounded-full">
              <Image
                alt="Userphoto"
                src={photo}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          ) : (
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-white ${
                year == 1
                  ? "bg-green-500"
                  : year == 2
                  ? "bg-yellow-500"
                  : year == 3
                  ? "bg-red-500"
                  : year == 4 && "bg-blue-500"
              }`}
            >
              {first.charAt(0)}
              {last.charAt(0)}
            </div>
          )}
        </div>
        <div className="w-32 pl-2">{studentid}</div>
        <div className="w-48 pl-2">{last}</div>
        <div className="w-48 pl-2">{first}</div>
        <div className="w-8 pl-2">{middle.charAt(0)}</div>
        <div className="w-12 pl-2">{year}</div>
        <div className="w-24 pl-2">{course}</div>
        <div className="w-22 pl-2">
          {applied ? (
            <p className="text-green-600">Applied</p>
          ) : (
            <p className="text-red-600">Not applied</p>
          )}
        </div>
      </div>
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
          <title>Reports | Registrar</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBar path="/admin/registrar/reports" session={session} />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full p-8">
              <div className="flex w-full justify-between">
                <div className="prose prose-slate w-full dark:prose-invert">
                  <h1 className="m-0 p-0">Reports</h1>
                </div>
                <div className="flex w-full items-center justify-end space-x-2 text-sm font-semibold">
                  <h6>
                    Show{" "}
                    {(studentIDQuery
                      ? filterStudentIDs
                      : lastNamesQuery
                      ? filterLastNames
                      : firstNamesQuery
                      ? filterFirstNames
                      : yearLevelsQuery
                      ? filterYearLevels
                      : coursesQuery
                      ? filterCourses
                      : list
                    ).length == 0
                      ? skip
                      : skip + 1}
                    -
                    {limit >=
                    (studentIDQuery
                      ? filterStudentIDs
                      : lastNamesQuery
                      ? filterLastNames
                      : firstNamesQuery
                      ? filterFirstNames
                      : yearLevelsQuery
                      ? filterYearLevels
                      : coursesQuery
                      ? filterCourses
                      : list
                    ).length
                      ? (studentIDQuery
                          ? filterStudentIDs
                          : lastNamesQuery
                          ? filterLastNames
                          : firstNamesQuery
                          ? filterFirstNames
                          : yearLevelsQuery
                          ? filterYearLevels
                          : coursesQuery
                          ? filterCourses
                          : list
                        ).length
                      : limit}{" "}
                    of{" "}
                    {
                      (studentIDQuery
                        ? filterStudentIDs
                        : lastNamesQuery
                        ? filterLastNames
                        : firstNamesQuery
                        ? filterFirstNames
                        : yearLevelsQuery
                        ? filterYearLevels
                        : coursesQuery
                        ? filterCourses
                        : list
                      ).length
                    }
                  </h6>
                  <button
                    disabled={skip == 0}
                    onClick={handleBack}
                    className="rounded border border-gray-500 p-1 hover:border-gray-900 disabled:border-gray-300 dark:border-gray-300 dark:hover:border-gray-100 dark:disabled:border-gray-700"
                  >
                    <ChevronLeftIcon className="h-3 w-3" />
                  </button>
                  <button
                    className="rounded border border-gray-500 p-1 hover:border-gray-900 disabled:border-gray-300 dark:border-gray-300 dark:hover:border-gray-100 dark:disabled:border-gray-700"
                    disabled={
                      skip >=
                      (studentIDQuery
                        ? filterStudentIDs
                        : lastNamesQuery
                        ? filterLastNames
                        : firstNamesQuery
                        ? filterFirstNames
                        : yearLevelsQuery
                        ? filterYearLevels
                        : coursesQuery
                        ? filterCourses
                        : list
                      ).length -
                        10
                    }
                    onClick={handleNext}
                  >
                    <ChevronRightIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="rounded-lg bg-white pb-4 shadow">
                <div className="mt-4 flex h-fit w-full space-x-2 rounded-t-lg bg-gray-100 py-2 px-4 text-xs font-semibold text-black">
                  <div className="w-14"></div>
                  <div className="w-32">
                    <h6>Student ID</h6>
                    <div className="relative">
                      <input
                        disabled={
                          lastNamesQuery ||
                          firstNamesQuery ||
                          yearLevelsQuery ||
                          coursesQuery
                        }
                        onChange={(event) => {
                          setStudentIDQuery(event.target.value);
                          setSkip(0);
                        }}
                        className="flex w-full items-center rounded border border-gray-300 bg-transparent p-1 text-sm"
                      ></input>
                      <SearchIcon className="absolute top-2 right-1 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-48">
                    <h6>Lastname</h6>
                    <div className="relative">
                      <input
                        disabled={
                          firstNamesQuery ||
                          studentIDQuery ||
                          yearLevelsQuery ||
                          coursesQuery
                        }
                        onChange={(event) => {
                          setLastNamesQuery(event.target.value);
                          setSkip(0);
                        }}
                        className="flex w-full items-center rounded border border-gray-300 bg-transparent p-1 text-sm"
                      ></input>
                      <SearchIcon className="absolute top-2 right-1 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-48">
                    <h6>Firstname</h6>
                    <div className="relative">
                      <input
                        disabled={
                          studentIDQuery ||
                          lastNamesQuery ||
                          yearLevelsQuery ||
                          coursesQuery
                        }
                        onChange={(event) => {
                          setFirstNamesQuery(event.target.value);
                          setSkip(0);
                        }}
                        className="flex w-full items-center rounded border border-gray-300 bg-transparent p-1 text-sm"
                      ></input>
                      <SearchIcon className="absolute top-2 right-1 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-8">M.I.</div>
                  <div className="w-12">
                    <h6>Year</h6>
                    <div className="relative">
                      <input
                        disabled={
                          studentIDQuery ||
                          lastNamesQuery ||
                          firstNamesQuery ||
                          coursesQuery
                        }
                        maxLength={1}
                        onChange={(event) => {
                          setYearlevelsQuery(event.target.value);
                          setSkip(0);
                        }}
                        className="flex w-full items-center rounded border border-gray-300 bg-transparent p-1 text-sm"
                      ></input>
                      <SearchIcon className="absolute top-2 right-1 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div className="w-24">
                    <h6>Course</h6>
                    <div className="relative">
                      <input
                        disabled={
                          studentIDQuery ||
                          lastNamesQuery ||
                          firstNamesQuery ||
                          yearLevelsQuery
                        }
                        onChange={(event) => {
                          setCoursesQuery(event.target.value);
                          setSkip(0);
                        }}
                        className="flex w-full items-center rounded border border-gray-300 bg-transparent p-1 text-sm"
                      ></input>
                      <SearchIcon className="absolute top-2 right-1 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                <div className="h-fit w-full">
                  {studentIDQuery ? (
                    filterStudentIDs.map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          id={item._id}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          applied={item.applied.isApplied}
                          course={item.department}
                        />
                      </div>
                    ))
                  ) : lastNamesQuery ? (
                    filterLastNames.map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          id={item._id}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          applied={item.applied.isApplied}
                          course={item.department}
                        />
                      </div>
                    ))
                  ) : firstNamesQuery ? (
                    filterFirstNames.map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          id={item._id}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          applied={item.applied.isApplied}
                          course={item.department}
                        />
                      </div>
                    ))
                  ) : yearLevelsQuery != 0 ? (
                    filterYearLevels
                      .slice(skip, skip + 10)
                      .map((item, index) => (
                        <div key={index}>
                          <ListRow
                            index={index}
                            studentid={item.username}
                            id={item._id}
                            photo={item.userphoto}
                            last={item.lastname}
                            first={item.firstname}
                            middle={item.middlename}
                            year={item.yearlevel}
                            applied={item.applied.isApplied}
                            course={item.department}
                          />
                        </div>
                      ))
                  ) : coursesQuery != 0 ? (
                    filterCourses.slice(skip, skip + 10).map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          id={item._id}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          applied={item.applied.isApplied}
                          course={item.department}
                        />
                      </div>
                    ))
                  ) : list.length > 0 ? (
                    list.slice(skip, skip + 10).map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          id={item._id}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          applied={item.applied.isApplied}
                          course={item.department}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-md flex w-full justify-center pt-4 text-slate-500">
                      No new applications
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
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
  const { data: students } = await axios.get(
    host + "/api/admin/registrar/reports"
  );
  if (session) {
    const { role, department } = session;
    if (role === "Admin" && department === "Registrar") {
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
          period: period.period,
          students: students.students,
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
