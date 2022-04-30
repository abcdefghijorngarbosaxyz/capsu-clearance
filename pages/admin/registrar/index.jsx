import SideBar from "../../../components/SideBar.Registrar";
import Head from "next/head";
import TopBar from "../../../components/TopBar";
import { getSession } from "next-auth/react";
import axios from "axios";
import CircleProgressBar from "../../../components/extras/CircleProgressBar";
import Router from "next/router";
import DialogModal from "../../../components/extras/DialogModal";
import { useState } from "react";

export default function RegistrarHome({
  session,
  appliedcount,
  allcount,
  completecount,
  period,
}) {
  const [closeProcessingModalOpen, setCloseProcessingModalOpen] =
    useState(false);

  const sendCloseProcessingModalState = (closeProcessingModalOpen) => {
    setCloseProcessingModalOpen(closeProcessingModalOpen);
  };

  const nextSchoolyear =
    period.semester === 2 ? period.schoolyear + 1 : period.schoolyear;
  const nextSemester =
    period.term === "Final" && period.semester === 2
      ? 1
      : period.term === "Final" && period.semester === 1
      ? 2
      : period.semester;
  const nextTerm = period.term === "Midterm" ? "Final" : "Midterm";

  const handleCloseProcessing = async () => {
    await axios
      .post("/api/admin/registrar/updateperiod", {
        open: false,
      })
      .then(Router.reload());
  };

  const handleOpenProcessing = async () => {
    await axios
      .post("/api/admin/registrar/updateperiod", {
        schoolyear: nextSchoolyear,
        semester: nextSemester,
        term: nextTerm,
        open: true,
      })
      .then(Router.reload());
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
          <title>Dashboard | Registrar</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBar path="/admin/registrar" session={session} />
        </div>
        <div className="h-full w-3/4 px-8">
          <div className="flex w-full items-center justify-between">
            <div className="prose prose-slate py-8 dark:prose-invert">
              <h1>Dashboard</h1>
            </div>
            {period.open && (
              <button
                onClick={() => setCloseProcessingModalOpen(true)}
                className=" rounded-lg bg-red-500 p-2 text-red-100 shadow"
              >
                Close processing of clearance
              </button>
            )}
          </div>
          {period.open ? (
            <>
              <div className="prose">
                <h3 className="text-gray-700 dark:text-gray-300">
                  Current Period:{" "}
                  {`${period.term}, ${
                    period.semester == 1 ? "1st" : "2nd"
                  } semester ${period.schoolyear - 1}-${period.schoolyear}`}
                </h3>
                <div></div>
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
            </>
          ) : (
            <div className="h-fit w-1/2 rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 p-8 shadow">
              <p className="text-lg font-bold text-gray-900">
                Open the processing of examination clearance for the period:{" "}
                <span className="text-black">{`${nextTerm}, ${
                  nextSemester === 2 ? "2nd" : "1st"
                } semester ${nextSchoolyear - 1}-${nextSchoolyear}`}</span>
              </p>
              <div className="mt-8 flex h-fit w-full justify-center">
                <button
                  className="rounded-md bg-gray-100 py-2 px-4 text-sm font-semibold text-amber-500 shadow-md hover:bg-white"
                  onClick={handleOpenProcessing}
                >
                  Open
                </button>
              </div>
            </div>
          )}
        </div>
        <DialogModal
          type="warning"
          submitAction={handleCloseProcessing}
          open={closeProcessingModalOpen}
          title="Close processing of clearance"
          sendModalState={sendCloseProcessingModalState}
          close="Cancel"
          submitButton="Yes, I am sure"
          body="Are you sure you want to close the processing of examination clearances for the current period? This action CANNOT be undone."
        />
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
    const { role, department } = session;
    if (role === "Admin" && department === "Registrar") {
      return {
        props: {
          session,
          completecount: complete.completecount,
          allcount: applied.allcount,
          appliedcount: applied.appliedcount,
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
