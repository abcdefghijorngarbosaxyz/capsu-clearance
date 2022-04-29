import { Tab, Disclosure, Transition } from "@headlessui/react";
import { CheckCircleIcon, DotsHorizontalIcon } from "@heroicons/react/solid";
import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import moment from "moment";
import Spinner from "../../../../components/extras/Spinner";
import SideBarStudent from "../../../../components/SideBar.Student";
import TopBar from "../../../../components/TopBar";
import { classNames } from "../../../../lib/classjoiner";
import ExamClearance from "../../../../components/ExamClearance";
import ScrollArea from "../../../../components/extras/ScrollArea";
import Image from "next/image";
import { useReactToPrint } from "react-to-print";
import jsPDF from "jspdf";
import $ from "jquery";
import DialogModal from "../../../../components/extras/DialogModal";

var socket;

export default function StudentV2({
  session,
  endpoint,
  isApplied,
  period,
  isApproved,
  signatures,
}) {
  socket = io(endpoint);

  const printComponentRef = useRef();

  const [applied, setApplied] = useState(isApplied);
  const [approved, setApproved] = useState(isApproved);
  const [loading, setLoading] = useState(false);
  const [clearance, setClearance] = useState([]);
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    socket.emit("clearance status initial", session);
    socket.on("clearance status data initial", (status) => {
      setClearance(status);
    });
    socket.on("clearance status data update", (status) => {
      setClearance(status);
    });
  }, []);

  const toggleClearanceFullScreen = () => {
    $("#fullclearanceview").get(0).requestFullscreen();
  };
  const handleApply = async () => {
    setLoading(true);
    const { data } = await axios.post("/api/student/apply", {
      studentid: session.id,
    });
    if (data && data.message === "Applied") {
      socket.emit("clearance list registrar update", session.department);
      setApplied(true);
      setLoading(false);
    }
  };

  const sendApplyModalState = (applyModalOpen) => {
    setApplyModalOpen(applyModalOpen);
  };
  const handlePrint = useReactToPrint({
    content: () => printComponentRef.current,
    documentTitle:
      session.firstname + " " + session.lastname + " Exam Clearance",
  });

  const handleDownloadPDF = () => {
    const pdf = new jsPDF("p", "pt", "a4");
    pdf.html($("#fullclearanceview").get(0)).then(() => {
      pdf.save(
        session.firstname + " " + session.lastname + " Exam Clearance.pdf"
      );
    });
  };

  return (
    <>
      <div className="flex h-screen w-screen">
        <Head>
          <title>{session.firstname} - Home | Student</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4 min-w-fit pt-20">
          <SideBarStudent path="/student/v2" session={session} />
        </div>
        <div className="h-full w-3/4 pl-8">
          <ScrollArea>
            <div className="prose prose-slate mt-20 py-8 pb-8 dark:prose-invert">
              <h1>Exam Clearance</h1>
            </div>
            <div className="flex w-full pr-8">
              <div className="mb-8 h-fit w-full rounded-lg  bg-gradient-to-r from-blue-400 to-blue-600 p-4 xl:w-2/3">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <Spinner color="bg-white" />
                  </div>
                ) : applied && approved ? (
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
                          <div className="w-full rounded-2xl bg-white p-2">
                            {clearance.map((item) => (
                              <Disclosure
                                as="div"
                                className="mt-2"
                                key={item[0]}
                              >
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
                                          ? "Collecting & Disbursing"
                                          : item[0] === "affairs"
                                          ? "Student Affairs "
                                          : item[0] === "department"
                                          ? "Dean / Program Chair"
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
                                              moment(
                                                new Date(item[1].signedDate)
                                              ).format("lll")}
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
                        <div className="flex w-full">
                          <div className="w-2/3">
                            <ExamClearance
                              signatures={signatures}
                              session={session}
                              period={period}
                            />
                            <div className="fixed top-full left-full">
                              <div
                                id="fullclearanceview"
                                ref={printComponentRef}
                                className="flex h-screen w-full items-center justify-center"
                              >
                                <ExamClearance
                                  signatures={signatures}
                                  session={session}
                                  period={period}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="h-fit w-1/3 space-y-4 rounded-md bg-white/50 p-4">
                            <div>
                              <button
                                onClick={toggleClearanceFullScreen}
                                className="flex"
                              >
                                <div className="relative h-6 w-6">
                                  <Image
                                    src="/assets/icons/fullscreen.png"
                                    layout="fill"
                                    priority
                                  />
                                </div>
                                <h6 className="ml-2 font-semibold text-gray-700">
                                  Fullscreen
                                </h6>
                              </button>
                            </div>
                            <div>
                              <button onClick={handlePrint} className="flex">
                                <div className="relative h-6 w-6">
                                  <Image
                                    src="/assets/icons/printer.png"
                                    layout="fill"
                                    priority
                                  />
                                </div>
                                <h6 className="ml-2 font-semibold text-gray-700">
                                  Print
                                </h6>
                              </button>
                            </div>
                            <div>
                              <button
                                onClick={handleDownloadPDF}
                                className="flex"
                              >
                                <div className="relative h-6 w-6">
                                  <Image
                                    src="/assets/icons/download.png"
                                    layout="fill"
                                    priority
                                  />
                                </div>
                                <h6 className="ml-2 font-semibold text-gray-700">
                                  Download
                                </h6>
                              </button>
                            </div>
                          </div>
                        </div>
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                ) : applied && !approved ? (
                  <div className="flex justify-center py-8">
                    <h3 className="text-lg font-bold text-white">
                      Waiting for approval.
                    </h3>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4 py-8">
                    <h3 className="text-lg font-bold text-white">
                      You haven&apos;t applied for clearance yet.
                    </h3>
                    <button
                      className="rounded-md bg-gray-100 py-2 px-4 text-sm font-semibold text-black shadow-md hover:bg-white"
                      onClick={() => {
                        setApplyModalOpen(true);
                      }}
                    >
                      Apply now
                    </button>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogModal
          type="submit"
          submitAction={handleApply}
          open={applyModalOpen}
          title="Apply for examination clearance"
          sendModalState={sendApplyModalState}
          close="Cancel"
          submitButton="Apply"
        >
          <div className="my-8 flex justify-center text-sm text-gray-400">
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
        </DialogModal>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });
  const host =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    `${process.env.HOSTNAME}`;
  const { data: period } = await axios.get(host + "/api/getperiod");
  if (session) {
    if (query.id !== session.id) {
      return {
        notFound: true,
      };
    }
    const { role } = session;
    if (role === "Student") {
      const { data: applied } = await axios.post(
        host + "/api/student/isapplied",
        { studentid: session.id }
      );
      const { data: approved } = await axios.post(
        host + "/api/student/isapproved",
        { studentid: session.id }
      );
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
          period: period.period,
          isApplied: applied.isApplied,
          isApproved: approved.isApproved,
          signatures: {
            registrar: process.env.SIGNATURE_REG,
            collecting: process.env.SIGNATURE_COL,
            affairs: process.env.SIGNATURE_AFF,
            library: process.env.SIGNATURE_LIB,
            department:
              session.department === "BSCS"
                ? process.env.SIGNATURE_BSCS
                : session.department === "BSCrim"
                ? process.env.SIGNATURE_BSCRIM
                : session.department === "BEED"
                ? process.env.SIGNATURE_BEED
                : session.department === "BSF"
                ? process.env.SIGNATURE_BSF
                : session.department === "BSFT" && process.env.SIGNATURE_BSFT,
          },
        },
      };
    } else if (role === "Admin")
      return {
        redirect: {
          permanent: false,
          destination: "/",
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
