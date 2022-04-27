import { getSession } from "next-auth/react";
import axios from "axios";
import TopBar from "../../../../components/TopBar";
import SideBar from "../../../../components/SideBar.Registrar";
import Head from "next/head";
import io from "socket.io-client";
import { useEffect, useState } from "react";
import ScrollArea from "../../../../components/extras/ScrollArea";
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DotsHorizontalIcon,
  ArrowsExpandIcon,
  PrinterIcon,
  DocumentDownloadIcon,
} from "@heroicons/react/outline";
import {
  EyeIcon,
  MailIcon,
  PencilIcon,
  CheckCircleIcon,
  ThumbUpIcon,
} from "@heroicons/react/solid";
import DialogModal from "../../../../components/extras/DialogModal";
import Image from "next/image";
import { Disclosure, Tab, Transition } from "@headlessui/react";
import ExamClearance from "../../../../components/ExamClearance";
import { classNames } from "../../../../lib/classjoiner";
import moment from "moment";

const course = {
  name: "Elementary Education",
  short: "BEED",
  alt: "education",
};
var socket;

export default function Completion({ session, signatures, period, endpoint }) {
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
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState("");
  const [selectedClearance, setSelectedClearance] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState({});
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

  const sendViewModalState = (viewModalOpen) => {
    setViewModalOpen(viewModalOpen);
  };

  const handleMessage = async () => {
    const { data } = await axios.post("/api/admin/sendnotification", {
      studentid: selectedId,
      notificationOffice: session.office,
      notificationMessage: message,
    });
    if (data) socket.emit("notifications latest", { id: selectedId });
  };

  const handleSign = async () => {
    try {
      const { data } = await axios.post("/api/admin/registrar/sign", {
        studentid: selectedId,
        signedby: session.firstname + " " + session.lastname,
      });
      if (data.message === "Signed") {
        socket.emit("clearance complete registrar update", course.short);
        socket.emit("clearance status update", { id: selectedId });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewClearance = async () => {
    socket.emit("clearance status initial", { id: selectedId });
    socket.on("clearance status data initial", (status) => {
      setSelectedClearance(status);
    });
  };

  useEffect(() => {
    socket.on("connection", () => {
      setSocketconnected(true);
    });
    socket.emit("clearance complete registrar initial", course.short);
    socket.on("clearance complete data initial", (students) => {
      setList(students);
    });
    socket.on("clearance complete data update", (students) => {
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
            <PencilIcon className="h-5 w-5" />
            Sign
          </button>
          <button
            onClick={() => {
              setViewModalOpen(true);
              setSelectedId(id);
              handleViewClearance();
              setSelectedStudent({
                id: selectedId,
                firstname: first,
                lastname: last,
                middlename: middle,
                department: course.short,
                yearlevel: year,
                applieddate: new Date(),
              });
            }}
            className="ml-4 flex items-center text-xs text-rose-500 hover:text-rose-600"
          >
            <EyeIcon className="h-5 w-5" />
            View
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

  const ClearanceView = () => {
    return (
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/[0.2] p-1">
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            List View
          </Tab>
          <Tab
            className={({ selected }) =>
              classNames(
                "w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700",
                "ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2",
                selected
                  ? "bg-white shadow"
                  : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
              )
            }
          >
            Document View
          </Tab>
        </Tab.List>
        <Tab.Panels className="mt-2">
          <Tab.Panel className="h-full ">
            <div className="w-full">
              <div className="w-full max-w-md rounded-2xl bg-white p-2">
                {selectedClearance.map((item) => (
                  <Disclosure as="div" className="mt-2" key={item[0]}>
                    {({ open }) => (
                      <>
                        <Disclosure.Button
                          className={`${
                            item[1].signed === "Signed"
                              ? "bg-green-100 hover:bg-green-200 focus-visible:ring-green-500"
                              : "bg-yellow-100 hover:bg-yellow-200 focus-visible:ring-yellow-500"
                          } flex w-full justify-between rounded-lg px-4 py-2 text-left text-sm font-medium focus:outline-none focus-visible:ring focus-visible:ring-opacity-75`}
                        >
                          <span className="flex text-black">
                            {item[0] === "registrar"
                              ? "Registrar "
                              : item[0] === "library"
                              ? "Library "
                              : item[0] === "collection"
                              ? "Cashier "
                              : item[0] === "affairs"
                              ? "Student Affairs "
                              : item[0] === "department"
                              ? "Dean - " + session.department + " "
                              : null}
                          </span>
                          {item[1].signed === "Signed" ? (
                            <span className="flex text-green-600">
                              <CheckCircleIcon className="h-5 w-5" />
                              Signed
                            </span>
                          ) : (
                            <DotsHorizontalIcon className="h-5 w-5 text-yellow-500" />
                          )}
                        </Disclosure.Button>
                        <Transition
                          show={open}
                          enter="transition duration-100 ease-out"
                          enterFrom="transform scale-95 opacity-0"
                          enterTo="transform scale-100 opacity-100"
                          leave="transition duration-75 ease-out"
                          leaveFrom="transform scale-100 opacity-100"
                          leaveTo="transform scale-95 opacity-0"
                        >
                          <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500">
                            {item[1].signed === "Signed" ? (
                              <span>
                                Signed by:{" "}
                                <span className="font-bold text-black">
                                  {item[1].signedBy}
                                </span>
                                {", " +
                                  moment(new Date(item[1].signedDate)).format(
                                    "lll"
                                  )}
                              </span>
                            ) : (
                              <span>Signed by: -</span>
                            )}
                          </Disclosure.Panel>
                        </Transition>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
              <div className="mt-4 flex justify-center text-sm text-white">
                {period &&
                  period.term +
                    ", " +
                    (period.semester === 1
                      ? "1st Semester "
                      : period.semester === 2
                      ? "2nd Semester "
                      : "Summer ") +
                    period.schoolyear}
              </div>
            </div>
          </Tab.Panel>
          <Tab.Panel>
            <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
              <div className="h-80 w-full">
                <ScrollArea>
                  <ExamClearance
                    signatures={signatures}
                    session={selectedStudent}
                    period={period}
                  />
                  {/* <div className="fixed top-full left-full">
                    <div
                      id="fullclearanceview"
                      ref={printComponentRef}
                      className="flex h-screen w-full items-center justify-center"
                    >
                      <ExamClearance
                        session={selectedStudent}
                        period={period}
                      />
                    </div>
                  </div> */}
                </ScrollArea>
              </div>
            </div>
            {/* <div className="mt-2 flex justify-end space-x-4 text-sm text-white md:mt-4">
              <button className="flex" onClick={toggleClearanceFullScreen}>
                <ArrowsExpandIcon className="h-5 w-5" /> Fullscreen
              </button>
              <button className="flex" onClick={handlePrint}>
                <PrinterIcon className="h-5 w-5" /> Print
              </button>
              <button className="flex" onClick={handleDownloadPDF}>
                <DocumentDownloadIcon className="h-5 w-5" /> Download
              </button>
            </div> */}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
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
          <title>{course.name} - For Completion | Registrar</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBar path={`completion/${course.alt}`} session={session} />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full p-8">
              <div className="flex w-full justify-between">
                <div className="prose prose-slate w-full dark:prose-invert">
                  <h1 className="m-0 p-0">{course.name}</h1>
                  <h6 className="">For completion</h6>
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
                      No new students
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
          title="Confirm sign"
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
        <DialogModal
          type="custom"
          open={viewModalOpen}
          sendModalState={sendViewModalState}
        >
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-8">
            <ClearanceView />
          </div>
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
    if (role === "Admin" && department === "Registrar") {
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
          course,
          period: period.period,
          signatures: {
            registrar: process.env.SIGNATURE_REG,
            collecting: process.env.SIGNATURE_COL,
            affairs: process.env.SIGNATURE_AFF,
            library: process.env.SIGNATURE_LIB,
            department: process.env.SIGNATURE_BEED,
          },
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
