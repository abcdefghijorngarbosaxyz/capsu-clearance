import { EmojiHappyIcon, EmojiSadIcon } from "@heroicons/react/outline";
import { CheckIcon, XCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import DialogModal from "../../../../components/extras/DialogModal";
import ScrollArea from "../../../../components/extras/ScrollArea";
import SideBarDean from "../../../../components/SideBar.Dean";
import TopBar from "../../../../components/TopBar";

export default function AdminAccounts({ course, session, admins }) {
  const [list, setList] = useState(admins);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const { query } = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { data } = await axios.post("/api/admin/newadmin", {
      username,
      password,
      firstname,
      lastname,
      department: session.department,
      office: session.office,
    });
    if (data.message !== "New admin added") {
      setErrorMessage("An error occured");
      setAlertModalOpen(true);
    }
    setAlertModalOpen(true);
  };

  const fetchList = async () => {
    const { data } = await axios.post("/api/admin/dean/adminaccounts", {
      department: session.department,
    });
    if (data) setList(data.list);
  };

  const sendDeleteModalState = (deleteModalOpen) => {
    setDeleteModalOpen(deleteModalOpen);
  };

  const handleDelete = async () => {
    const response = await axios.post("/api/admin/dean/admindelete", {
      adminid: selectedAdmin,
    });
    if (response) fetchList();
  };

  const sendAlertModalState = (alertModalOpen) => {
    setAlertModalOpen(alertModalOpen);
  };

  const AdminList = ({ name, index, adminid }) => {
    return (
      <>
        <div
          className={`flex h-16 items-center space-x-2 border-b py-2 px-4 text-sm font-semibold text-black ${
            index % 2 != 0 ? "bg-gray-100" : "bg-white"
          }`}
        >
          <div className="w-3/4">{name}</div>
          <div className="flex w-1/4 justify-center pl-2">
            <button
              onClick={() => {
                setSelectedAdmin(adminid);
                setDeleteModalOpen(true);
              }}
              className="ml-4 flex items-center text-xs text-red-500 hover:text-red-600"
            >
              <XCircleIcon className="h-5 w-5" />
              Delete
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
          <title>Admin Accounts | {course.short} - Dean&apos;s Office</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4">
          <SideBarDean
            path={`/admin/dean/${session.department.toLowerCase()}/adminaccounts`}
            session={session}
            course={course}
          />
        </div>
        <div className="h-full w-3/4">
          <ScrollArea>
            <div className="h-full w-full p-8">
              <div className="flex w-full items-center justify-between">
                <div className="prose prose-slate dark:prose-invert">
                  <h1>Admin Accounts</h1>
                </div>
                {query.action && query.action === "delete" ? (
                  <Link
                    href={`/admin/dean/${course.short.toLowerCase()}/adminaccounts?action=add`}
                  >
                    <div className="cursor-pointer rounded-lg bg-blue-400 p-2 text-sm font-bold text-white hover:bg-blue-600">
                      Add new admin
                    </div>
                  </Link>
                ) : query.action && query.action === "add" ? (
                  <Link
                    href={`/admin/dean/${course.short.toLowerCase()}/adminaccounts?action=delete`}
                  >
                    <div className="cursor-pointer rounded-lg bg-red-400 p-2 text-sm font-bold text-white hover:bg-red-600">
                      Delete admin
                    </div>
                  </Link>
                ) : (
                  <></>
                )}
              </div>
              {query.action && query.action === "delete" ? (
                <div className="mt-8 w-full rounded-lg bg-white shadow">
                  <div className="mt-4 flex h-fit w-full space-x-2 rounded-t-lg bg-gray-100 py-2 px-4 text-xs font-semibold text-black">
                    <div className="w-1/2">
                      <h6>Name</h6>
                    </div>
                  </div>
                  {list.length > 0 ? (
                    list
                      .filter((item) => item._id != session.id)
                      .map((item, index) => (
                        <AdminList
                          name={item.firstname + " " + item.lastname}
                          key={index}
                          index={index}
                          adminid={item._id}
                        />
                      ))
                  ) : (
                    <div className="text-md flex w-full justify-center pt-4 text-slate-500">
                      No new admins
                    </div>
                  )}
                </div>
              ) : query.action && query.action === "add" ? (
                <form
                  onSubmit={handleSubmit}
                  className="mt-8 grid h-fit w-full grid-cols-6 gap-4 rounded-lg bg-gradient-to-r from-sky-400 to-sky-600 p-4 text-gray-900 shadow backdrop-blur"
                >
                  <div className="col-span-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      className="mt-1 block  w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-5"></div>
                  <div className="col-span-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="mt-1 block  w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-4"></div>
                  <div className="col-span-3">
                    <label
                      htmlFor="firstname"
                      className="block text-sm font-medium text-white"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      id="firstname"
                      value={firstname}
                      onChange={(event) => setFirstname(event.target.value)}
                      className="mt-1 block  w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-3">
                    <label
                      htmlFor="lastname"
                      className="block text-sm font-medium text-white"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      id="lastname"
                      value={lastname}
                      onChange={(event) => setLastname(event.target.value)}
                      className="mt-1 block  w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
                    />
                  </div>
                  <div className="col-span-6 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    >
                      Save
                    </button>
                  </div>
                </form>
              ) : (
                <></>
              )}
            </div>
            <button onClick={fetchList}>click</button>
          </ScrollArea>
        </div>
        <DialogModal
          type="flash"
          flash={
            errorMessage ? (
              <EmojiSadIcon className="h-20 w-20 text-red-500" />
            ) : (
              <EmojiHappyIcon className="h-20 w-20 text-green-500" />
            )
          }
          open={alertModalOpen}
          title={errorMessage ? "An error occured" : "Success"}
          body={
            errorMessage
              ? "Please check if the admin information are correct and there are no fields that are empty"
              : "New admin added"
          }
          sendModalState={sendAlertModalState}
          close={errorMessage ? "Retry" : "OK"}
        />
        <DialogModal
          type="submit"
          submitAction={handleDelete}
          open={deleteModalOpen}
          title="Confirm approve"
          sendModalState={sendDeleteModalState}
          close="Cancel"
          submitButton="Delete"
          body="Are you sure you want to delete this admin?"
        ></DialogModal>
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
        const { data: admins } = await axios.post(
          host + "/api/admin/dean/adminaccounts",
          { department: session.department }
        );
        return {
          props: {
            course: sessionCourse,
            session,
            admins: admins.list,
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
