import { getSession } from "next-auth/react";
import axios from "axios";
import TopBar from "../../../../components/TopBar";
import Head from "next/head";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import ScrollArea from "../../../../components/extras/ScrollArea";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/outline";
import { MailIcon, ThumbUpIcon } from "@heroicons/react/solid";
import DialogModal from "../../../../components/extras/DialogModal";
import Image from "next/image";
import SideBarCLA from "../../../../components/SideBar.CLA";

const course = {
  name: "Criminology",
  short: "BSCrim",
  alt: "criminology",
};
var socket;

export default function AffairsSign({ session, period, endpoint }) {
  socket = io(endpoint);

  const [socketconnected, setSocketconnected] = useState(false);
  const [newData, setNewData] = useState(0);
  const [studentIDQuery, setStudentIDQuery] = useState("");
  const [lastNamesQuery, setLastNamesQuery] = useState("");
  const [firstNamesQuery, setFirstNamesQuery] = useState("");
  const [yearLevelsQuery, setYearlevelsQuery] = useState(0);

  const [list, setList] = useState([]);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);

  const [signModalOpen, setSignModalOpen] = useState(false);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");

  const handleBack = () => {
    setSkip(skip - 10);
    setLimit(limit - 10);
  };
  const handleNext = () => {
    setSkip(skip + 10);
    setLimit(limit + 10);
  };

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

  const sendSignModalState = (signModalOpen) => {
    setSignModalOpen(signModalOpen);
  };

  const sendMessageModalState = (messageModalOpen) => {
    setMessageModalOpen(messageModalOpen);
  };

  const handleMessage = async () => {
    const { data } = await axios.post("/api/admin/sendnotification", {
      studentid: selectedId,
      notificationOffice: session.office,
      notificationMessage: message,
      userphoto: session.userphoto,
      sender: session.firstname + " " + session.lastname,
    });
    if (data) socket.emit("mesage affairs update", { id: selectedId });
  };

  const handleSign = async () => {
    try {
      const { data } = await axios.post("/api/admin/affairs/sign", {
        studentid: selectedId,
        signedby: session.firstname + " " + session.lastname,
      });
      if (data.message === "Signed") {
        socket.emit("clearance affairs update", course.short);
        socket.emit("clearance status update", { id: selectedId });
        socket.emit("clearance complete registrar update", course.short);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("connection", () => {
      setSocketconnected(true);
    });
    socket.emit("clearance affairs initial", course.short);
    socket.on("clearance affairs data initial", (students) => {
      setList(students);
    });
    socket.on("clearance affairs data update", (students) => {
      setList(students);
    });
  }, []);

  const ListRow = ({
    id,
    studentid,
    photo,
    last,
    first,
    middle,
    year,
    index,
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
        <div className="flex w-44 pl-2">
          <button
            onClick={() => {
              setSignModalOpen(true);
              setSelectedId(id);
            }}
            className="flex items-center text-xs text-sky-500 hover:text-sky-600"
          >
            <ThumbUpIcon className="h-5 w-5" />
            Sign
          </button>
          <button
            onClick={() => {
              setMessageModalOpen(true);
              setSelectedId(id);
              setMessage("");
            }}
            className="ml-4 flex items-center text-xs text-yellow-500 hover:text-yellow-600"
          >
            <MailIcon className="h-5 w-5" />
            Message
          </button>
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
          <title>
            {course.name} - For Signing | {session.department} Office
          </title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBarCLA path={`sign/${course.alt}`} session={session} />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full p-8">
              <div className="flex w-full justify-between">
                <div className="prose prose-slate w-full dark:prose-invert">
                  <h1 className="m-0 p-0">{course.name}</h1>
                  <h6 className="">For signing</h6>
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
                          lastNamesQuery || firstNamesQuery || yearLevelsQuery
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
                          firstNamesQuery || studentIDQuery || yearLevelsQuery
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
                          studentIDQuery || lastNamesQuery || yearLevelsQuery
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
                          studentIDQuery || lastNamesQuery || firstNamesQuery
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
        <DialogModal
          type="submit"
          submitAction={handleSign}
          open={signModalOpen}
          title="Confirm signing"
          sendModalState={sendSignModalState}
          close="Cancel"
          submitButton="Sign"
          body="Are you sure you want to sign the exam clearance of this student?"
        ></DialogModal>
        <DialogModal
          type="submit"
          title="Send a message"
          submitAction={handleMessage}
          open={messageModalOpen}
          sendModalState={sendMessageModalState}
          submitButton="Send"
          close="Cancel"
        >
          <textarea
            value={message}
            className="focus:ring-offset h-40 w-full rounded-md border border-gray-400/50 bg-transparent px-2 py-1 text-sm focus:ring-offset-sky-500 dark:border-gray-700/50"
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            placeholder="Type here..."
          ></textarea>
        </DialogModal>
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
    const { role, department } = session;
    if (role === "Admin" && department === "Affairs") {
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
