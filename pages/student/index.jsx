import { getSession, signOut } from "next-auth/react";
import TopBar from "../../components/TopBar";
import { useEffect, useState, Fragment } from "react";
import { classNames } from "../../lib/classjoiner";
import SingleMessage from "../../components/SingleMessage";
import { Transition, Dialog, Tab, Disclosure } from "@headlessui/react";
import {
  DotsHorizontalIcon,
  HomeIcon,
  InboxIcon,
  MenuAlt2Icon,
  PencilAltIcon,
  XIcon,
} from "@heroicons/react/outline";
import { CheckCircleIcon, RefreshIcon } from "@heroicons/react/solid";
import io from "socket.io-client";
import moment from "moment";
import clearance from "../../mockdata/clearance.json";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

var status = [];
var socket;

export default function StudentHome({ endpoint, session }) {
  socket = io(endpoint);
  const [newNotificationShow, setNewNotificationShow] = useState(false);
  const [newNotification, setNewNotification] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [socketconnected, setSocketconnected] = useState(false);
  const [loadingClearance, setLoadingClearance] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const refresh = () => {
    setNewNotification({});
    setNewNotificationShow(false);
    socket.emit("notifications initial", session);
  };
  const getClearanceStatus = () => {
    for (var i in clearance) {
      status.push([i, clearance[i]]);
    }
    setLoadingClearance(false);
  };
  useEffect(() => {
    socket.on("initial notifications", (data) => {
      for (var i in data) {
        setNotifications(data);
      }
    });
  }, [newNotification]);

  useEffect(() => {
    if (loadingClearance) getClearanceStatus();
  }, []);

  useEffect(() => {
    socket.emit("notifications initial", session);
  }, []);

  useEffect(() => {
    socket.on("connection", () => {
      setSocketconnected(true);
    });
    socket.on("latest notifications", (datalatest) => {
      setNewNotification(datalatest);
      socket.emit("notifications initial", session);
      setNewNotificationShow(true);
    });
  }, []);

  const SideNav = () => {
    return (
      <div className="prose prose-slate flex h-full w-full flex-col justify-between pt-10 pb-8 dark:prose-invert">
        <div className="group relative flex h-full w-full flex-col rounded-lg px-4 pt-4 pb-12 hover:bg-slate-400/10 dark:hover:bg-slate-700/50 lg:-m-4 lg:pl-4 lg:pb-0">
          <div className="hidden h-20 w-full items-center lg:flex">
            <div
              className={`${
                !session.userphoto && "bg-sky-500"
              } relative h-20 w-20 rounded-full`}
            >
              {session.userphoto ? (
                <Image
                  alt="User photo"
                  priority
                  src={session.userphoto}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="item flex h-full w-full items-center justify-center rounded-full text-5xl">
                  {session.firstname.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="flex max-h-fit flex-col items-start pl-4 font-medium">
              <span className="text-sm">Welcome,</span>
              <span className="text-xl font-bold text-sky-500">
                {session.firstname}&nbsp;
                <span>{session.middlename.charAt(0) + "."}&nbsp;</span>
                <span>{session.lastname}</span>
              </span>
            </h1>
          </div>
          <div className="flex w-full flex-col items-center justify-center lg:hidden">
            <div
              className={`${
                !session.userphoto && "bg-sky-500"
              } relative h-28 w-28 rounded-full`}
            >
              {session.userphoto ? (
                <Image
                  alt="User photo"
                  priority
                  src={session.userphoto}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <div className="item flex h-full w-full items-center justify-center rounded-full text-5xl">
                  {session.firstname.charAt(0)}
                </div>
              )}
            </div>
            <h1 className="flex max-h-fit flex-col items-start pl-4 font-medium">
              <span className="text-sm">Welcome,</span>
              <span className="text-xl font-bold text-sky-500">
                {session.firstname}&nbsp;
                <span>{session.lastname}</span>
              </span>
            </h1>
          </div>
          <div className="mt-6 flex h-fit w-full">
            <div className="h-fit w-1/2">ID number</div>
            <div className="h-fit w-1/2">{session.username}</div>
          </div>
          <div className="flex h-fit w-full">
            <div className="h-fit w-1/2">Course</div>
            <div className="h-fit w-1/2">{session.department}</div>
          </div>
          <div className="flex h-fit w-full">
            <div className="h-fit w-1/2">Year &amp; Section</div>
            <div className="h-fit w-1/2">
              {session.yearlevel + session.section}
            </div>
          </div>
          <Link href="/student/editdata">
            <span className="invisible absolute left-2 bottom-2 flex h-fit w-fit cursor-pointer items-center text-sm hover:text-black group-hover:visible dark:hover:text-white">
              <PencilAltIcon className="mr-2 h-6 w-6" />
              Edit
            </span>
          </Link>
        </div>
        <div className="flex h-full w-full items-end border-b border-gray-300/[0.5] px-4 py-4 dark:border-gray-700/[0.5] lg:px-0">
          <Link href="/student">
            <div className="flex h-6 w-fit cursor-pointer items-center">
              <div className="relative h-6 w-6">
                <Image src="/assets/icons/home.png" layout="fill" priority />
              </div>
              <h4 className="mb-6 pl-4 text-black dark:text-white">Home</h4>
            </div>
          </Link>
        </div>
        <div className="flex h-fit w-full items-end px-4 pt-4 lg:px-0">
          <div className="group w-fit">
            <button onClick={signOut} className="flex h-6 w-fit items-center">
              <div className="relative h-6 w-6">
                <Image src="/assets/icons/logout.png" layout="fill" priority />
              </div>
              <h4 className="mb-6 pl-4 text-slate-700 group-hover:text-black dark:text-slate-400 dark:group-hover:text-white">
                Logout
              </h4>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const MessagesView = () => {
    return (
      <>
        <div className="prose prose-slate py-8 dark:prose-invert">
          <h1>Messages</h1>
        </div>
        <Transition
          show={newNotificationShow}
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="-translate-x-1/4"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="-translate-x-1/4"
          onClick={refresh}
        >
          <div className="mb-4 h-fit w-full cursor-pointer rounded-lg bg-gradient-to-r from-orange-400 to-orange-600 py-4 dark:prose-invert">
            <SingleMessage
              sender={newNotification.notificationOffice}
              message={newNotification.notificationMessage}
              date={newNotification.notificationDate}
            />
          </div>
        </Transition>

        {notifications.length > 0 &&
          notifications
            .slice(newNotification.notificationMessage ? 1 : 0)
            .map((item, index) => (
              <div
                key={index}
                className="mb-4 h-fit w-full rounded-lg bg-gradient-to-r from-amber-400 to-amber-600 py-4 dark:prose-invert"
              >
                <SingleMessage
                  sender={item.notificationOffice}
                  message={item.notificationMessage}
                  date={item.notificationDate}
                />
              </div>
            ))}
      </>
    );
  };

  const ClearanceView = () => {
    return (
      <div id="clearance" className="mt-8 mb-8 h-fit w-screen max-w-md">
        <div className="prose prose-slate mb-8 dark:prose-invert">
          <h1>Students&apos; Clearance</h1>
        </div>
        <div className="h-fit w-full rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 p-6">
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
                  <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
                    {status.map((item) => (
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
                                  : item[0] === "cashier"
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
                </div>
              </Tab.Panel>
              <Tab.Panel>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ullam,
                error et. Soluta corrupti illum, laborum dolores in repudiandae
                qui harum dolore, ea, quidem asperiores vitae praesentium
                reiciendis tempora temporibus beatae. Suscipit voluptate
                laudantium vitae deserunt sint. Saepe cupiditate, cum tenetur
                aspernatur labore tempore ex beatae in veritatis? Autem,
                suscipit natus.
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>{session.firstname} | Home</title>
      </Head>
      <div className="flex max-h-screen w-screen">
        <div className="mt-18 w-full px-4 md:hidden md:px-8">
          <Tab.Group defaultIndex={0}>
            <Tab.Panels className="mt-2">
              <Tab.Panel className="flex justify-center">
                <ClearanceView />
              </Tab.Panel>
              <Tab.Panel className="flex flex-col justify-center">
                <MessagesView />
              </Tab.Panel>
            </Tab.Panels>
            <Tab.List className="fixed bottom-0 left-0 flex h-20 w-full px-2 pb-2 sm:px-12">
              <div className="flex w-full rounded-2xl bg-white shadow-lg shadow-gray-500 dark:bg-gray-900 dark:shadow-gray-900">
                <div className="flex h-full w-full flex-col items-center justify-center">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="h-8 w-8 sm:scale-x-[-1]"
                  >
                    {menuOpen ? <XIcon /> : <MenuAlt2Icon />}
                  </button>
                  <h6 className="text-xs text-gray-500">Menu</h6>
                </div>
                <Tab
                  className={({ selected }) =>
                    `${
                      selected ? "text-sky-500" : "text-gray-500"
                    } flex h-full w-full flex-col items-center justify-center`
                  }
                >
                  <HomeIcon className="h-8 w-8" />
                  <h6 className="text-xs">Home</h6>
                </Tab>
                <Tab
                  className={({ selected }) =>
                    `${
                      selected ? "text-sky-500" : "text-gray-500"
                    } flex h-full w-full flex-col items-center justify-center`
                  }
                >
                  <InboxIcon className="h-8 w-8" />
                  <h6 className="text-xs">Messages</h6>
                </Tab>
              </div>
            </Tab.List>
          </Tab.Group>
        </div>
        <Transition.Root show={menuOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 overflow-hidden lg:hidden"
            onClose={setMenuOpen}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-500"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-500"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="absolute inset-0 bg-gray-100 bg-opacity-30 backdrop-blur transition-opacity dark:bg-gray-900 dark:bg-opacity-30" />
              </Transition.Child>
              <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="-translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="-translate-x-full"
                >
                  <div className="pointer-events-auto relative w-screen max-w-xs">
                    <Transition.Child
                      as={Fragment}
                      enter="ease-in-out duration-500"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in-out duration-500"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="absolute top-0 left-72 -mr-8 flex pt-4 pl-2 sm:-mr-10 sm:pl-4">
                        <button
                          type="button"
                          className="rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span className="sr-only">Close panel</span>
                          <XIcon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </Transition.Child>
                    <div className="flex h-full w-72 flex-col bg-gray-100/70 px-4 shadow-xl dark:bg-gray-900/70">
                      <SideNav />
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <div
          id="desktop"
          className="mx-8 hidden h-full w-full flex-row-reverse md:flex"
        >
          <div className="fixed top-0 left-8 hidden h-screen w-1/4 pt-18 lg:flex">
            <SideNav />
          </div>
          <div className="fixed left-0 top-0 flex h-screen w-3/5 px-8 pt-18 lg:left-1/4 lg:w-2/4 lg:justify-center">
            <ClearanceView />
          </div>
          <div className="h-fit w-2/5 py-18 lg:w-1/4">
            <MessagesView />
          </div>
        </div>
        <TopBar session={true}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="hidden h-8 w-8 sm:scale-x-[-1] md:flex lg:hidden"
          >
            {menuOpen ? <XIcon /> : <MenuAlt2Icon />}
          </button>
          <button onClick={refresh}>
            <RefreshIcon className="h-6 w-6" />
          </button>
        </TopBar>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  if (session) {
    const { role } = session;
    if (role === "Student") {
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
        },
      };
    } else if (role === "Admin")
      return {
        redirect: {
          permanent: false,
          destination: "/admin/" + session.department.toLowerCase(),
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
