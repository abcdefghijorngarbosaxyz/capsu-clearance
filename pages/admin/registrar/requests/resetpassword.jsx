import axios from "axios";
import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";
import Head from "next/head";
import TopBar from "../../../../components/TopBar";
import SideBar from "../../../../components/SideBar.Registrar";
import { getSession } from "next-auth/react";
import ScrollArea from "../../../../components/extras/ScrollArea";
import Image from "next/image";
import { EyeIcon, PaperAirplaneIcon } from "@heroicons/react/outline";
import DialogModal from "../../../../components/extras/DialogModal";

export default function PasswordResets({ requests, session }) {
  const [proofModalOpen, setProofModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState({});
  const [list, setList] = useState(requests);

  const sendProofModalState = (proofModalOpen) => {
    setProofModalOpen(proofModalOpen);
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_tib5f2z",
        "template_baslq3p",
        e.target,
        "TA5Tv9vbUY2nsgarb"
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    emailjs
      .sendForm(
        "service_tib5f2z",
        "template_baslq3p",
        event.target,
        "TA5Tv9vbUY2nsgarb"
      )
      .then(
        async (result) => {
          if (result.text === "OK") {
            await axios
              .post("/api/admin/registrar/requests/resetpassworddelete", {
                username: event.target.username.value,
                linkId: event.target.linkid.value,
              })
              .then(async () => {
                const { data } = await axios.get(
                  "/api/admin/registrar/requests/resetpassword"
                );
                setList(data.list);
              });
          }
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const ListRow = ({
    studentid,
    photo,
    last,
    first,
    middle,
    year,
    index,
    course,
    reset,
  }) => {
    return (
      <div
        className={`flex h-16 items-center space-x-2 border-b border-gray-300 py-2 px-4 text-sm font-semibold text-black ${
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
        <div className="w-28">{studentid}</div>
        <div className="w-36">{last}</div>
        <div className="w-36">{first}</div>
        <div className="w-8">{middle.charAt(0)}</div>
        <div className="w-12">{year}</div>
        <div className="w-16">{course}</div>
        <button
          onClick={() => {
            setProofModalOpen(true);
            setSelectedStudent(reset);
          }}
          className="flex items-center pr-4 text-xs text-blue-500 hover:text-blue-600"
        >
          <EyeIcon className="h-5 w-5" />
          Proof
        </button>
        <form
          onSubmit={(event) => {
            handleSubmit(event);
          }}
        >
          <input type="hidden" name="username" value={studentid} />
          <input type="hidden" name="linkid" value={reset.linkId} />
          <input type="hidden" name="email_who" value={first} />
          <input type="hidden" name="email" value={reset.email} />
          <input
            type="hidden"
            name="link"
            value={`https://capsu-clearance.vercel.app/account/password/recovery/${reset.linkId}`}
          />
          <button
            type="submit"
            className="flex items-center text-xs text-green-500 hover:text-green-600"
          >
            <PaperAirplaneIcon className="h-4 w-4 rotate-90" />
            Send Reset Link
          </button>
        </form>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Requests - Password Reset | Registrar</title>
      </Head>
      <TopBar />
      {/* <div className="flex h-screen items-center justify-center p-4 lg:hidden">
        <h3 className="text-center text-5xl">
          Phone or tablet screen size NOT available for admin users.
        </h3>
      </div> */}
      <div className="hidden h-screen w-screen pt-20 md:flex">
        <div className="h-full w-1/4">
          <SideBar
            path="/admin/registrar/requests/resetpassword"
            session={session}
          />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full px-8">
              <div className="prose prose-slate py-8 dark:prose-invert">
                <h1>Password Reset Requests</h1>
              </div>
              <div className="h-fit w-full rounded-lg bg-white pb-4 shadow">
                <div className="mt-4 flex h-fit w-full space-x-2 rounded-t-lg bg-gray-100 py-2 px-4 text-xs font-semibold text-black">
                  <div className="w-14"></div>
                  <div className="w-28">
                    <h6>Student ID</h6>
                  </div>
                  <div className="w-36">
                    <h6>Lastname</h6>
                  </div>
                  <div className="w-36">
                    <h6>Firstname</h6>
                  </div>
                  <div className="w-8">M.I.</div>
                  <div className="w-12">
                    <h6>Year</h6>
                  </div>
                  <div className="w-24">
                    <h6>Course</h6>
                  </div>
                </div>
                <div className="h-fit w-full">
                  {list.length > 0 ? (
                    list.map((item, index) => (
                      <div key={index}>
                        <ListRow
                          index={index}
                          studentid={item.username}
                          photo={item.userphoto}
                          last={item.lastname}
                          first={item.firstname}
                          middle={item.middlename}
                          year={item.yearlevel}
                          course={item.department}
                          reset={item.reset}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="flex w-full justify-center">
                      No new requests
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        <DialogModal
          type="custom"
          open={proofModalOpen}
          sendModalState={sendProofModalState}
        >
          <div className="relative h-96 w-full">
            <Image
              src={selectedStudent.proof}
              layout="fill"
              objectFit="contain"
            />
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
  const { data } = await axios.get(
    host + "/api/admin/registrar/requests/resetpassword"
  );
  if (session) {
    const { role, department } = session;
    if (role === "Admin" && department === "Registrar") {
      return {
        props: {
          session,
          requests: data.list,
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
