import { getSession } from "next-auth/react";
import Head from "next/head";
import SideBarStudent from "../../../../components/SideBar.Student";
import TopBar from "../../../../components/TopBar";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Tab } from "@headlessui/react";
import ScrollArea from "../../../../components/extras/ScrollArea";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import Image from "next/image";
import moment from "moment";

var socket;

export default function Messages({ session, endpoint }) {
  socket = io(endpoint);

  const [messageLibrary, setMessageLibrary] = useState([]);
  const [messageDepartment, setMessageDepartment] = useState([]);
  const [messageRegistrar, setMessageRegistrar] = useState([]);
  const [messageCollecting, setMessageCollecting] = useState([]);
  const [messageAffairs, setMessageAffairs] = useState([]);
  const [num, setNum] = useState(0);
  const [tabNotifications, setTabNotifications] = useState([]);

  const { query } = useRouter();

  useEffect(() => {
    socket.emit("message library initial", session);
    socket.on("message library initial data", (data) => {
      if (data.length > 0) setMessageLibrary(data);
    });
    socket.emit("message department initial", session);
    socket.on("message department initial data", (data) => {
      if (data.length > 0) setMessageDepartment(data);
    });
    socket.emit("message registrar initial", session);
    socket.on("message registrar initial data", (data) => {
      if (data.length > 0) setMessageRegistrar(data);
    });
    socket.emit("message collecting initial", session);
    socket.on("message collecting initial data", (data) => {
      if (data.length > 0) setMessageCollecting(data);
    });
    socket.emit("message affairs initial", session);
    socket.on("message affairs initial data", (data) => {
      if (data.length > 0) setMessageAffairs(data);
    });
  }, []);

  useEffect(() => {
    socket.on("message library update data", (data) => {
      if (data.length > 0) setMessageLibrary(data);
    });
    socket.on("message department update data", (data) => {
      if (data.length > 0) setMessageDepartment(data);
      socket.emit("message registrar initial", session);
    });
    socket.on("message registrar update data", (data) => {
      if (data.length > 0) setMessageRegistrar(data);
    });
    socket.on("message collecting update data", (data) => {
      if (data.length > 0) setMessageCollecting(data);
    });
    socket.on("message affairs update data", (data) => {
      if (data.length > 0) setMessageAffairs(data);
    });
  }, []);

  const Moment = ({ dateAttr }) => {
    const messageDate = new Date(dateAttr).toUTCString();
    const messageDateUTC = new Date(messageDate);
    const nowDate = new Date();

    if (
      7 > nowDate.getDate() - messageDateUTC.getDate() > 0 &&
      nowDate.getMonth() === messageDateUTC.getMonth()
    )
      return (
        <h6 className="text-xs">
          {moment(messageDateUTC).fromNow() +
            ", " +
            moment(messageDateUTC).format("LT")}
        </h6>
      );
    return <h6 className="text-xs">{moment(messageDateUTC).format("lll")}</h6>;
  };

  useEffect(() => {
    setTabNotifications([
      messageCollecting,
      messageDepartment,
      messageLibrary,
      messageRegistrar,
      messageAffairs,
    ]);
  }, [
    messageCollecting,
    messageDepartment,
    messageLibrary,
    messageRegistrar,
    messageAffairs,
  ]);

  useEffect(() => {
    if (tabNotifications.length > 0) {
      const defaultQuery = tabNotifications[0][0];
      if (defaultQuery) {
        Router.push(
          `/student/v2/${session.id}/messages?sender=${defaultQuery.notificationOffice}`
        );
      }
    }
  }, [
    query.sender,
    tabNotifications,
    messageAffairs,
    messageCollecting,
    messageDepartment,
    messageLibrary,
    messageRegistrar,
  ]);

  useEffect(() => {
    if (tabNotifications.length > 0) {
      const defaultQuery = tabNotifications[0][0];
      if (defaultQuery) {
        Router.push(
          `/student/v2/${session.id}/messages?sender=${defaultQuery.notificationOffice}`
        );
      }
    }
  }, []);

  const SingleMessage = ({ item }) => {
    return (
      <>
        <div className="flex w-fit pb-8">
          <div className="relative h-8 w-8">
            {item.notificationPhoto && (
              <Image
                src={item.notificationPhoto}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
          <div className="ml-2 h-fit w-fit">
            <div className="w-fit rounded-2xl bg-sky-900 p-3 text-sm text-gray-300">
              {item.notificationMessage}
            </div>
            <div className="text-gray-500">
              <Moment dateAttr={item.notificationDate} />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="flex h-screen w-screen">
        <Head>
          <title>{session.firstname} - Settings | Student</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4 min-w-fit pt-20">
          <SideBarStudent path="/student/v2/messages" session={session} />
        </div>
        <div className="flex h-full w-3/4 pl-8">
          <div className="h-full w-1/2 pr-8">
            <div className="prose prose-slate mt-20 py-8 dark:prose-invert">
              <h1>Messages</h1>
            </div>
            <div className="flex h-2/3 w-full flex-col justify-start rounded-lg bg-gradient-to-r from-cyan-400 to-sky-500 py-2 shadow">
              {tabNotifications.length > 0 &&
                tabNotifications
                  .sort(
                    (min, max) =>
                      new Date(min[0] && min[0].notificationDate) -
                      new Date(max[0] && max[0].notificationDate)
                  )
                  .reverse()
                  .map((item, index) => (
                    <div key={index}>
                      {item[0] && (
                        <div className="h-20 w-full px-4 py-2">
                          <Link
                            className="h-full w-full"
                            href={`/student/v2/${session.id}/messages?sender=${item[0].notificationOffice}`}
                          >
                            <div
                              className={`flex h-full w-full cursor-pointer items-center rounded-lg px-4 shadow-md ${
                                query.sender === item[0].notificationOffice
                                  ? "bg-sky-900 bg-opacity-75 text-white ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                                  : "bg-white"
                              }`}
                            >
                              <div
                                className={`relative h-12 w-12 rounded-full border-2 ${
                                  query.sender === item[0].notificationOffice
                                    ? "border-white/50"
                                    : "border-black/50"
                                }`}
                              >
                                {item[0].notificationPhoto && (
                                  <Image
                                    src={item[0].notificationPhoto}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-full"
                                  />
                                )}
                              </div>
                              <div className="flex h-full w-fit flex-col justify-center pl-4">
                                <div className="text-sm">
                                  <p
                                    className={`font-medium  ${
                                      query.sender ===
                                      item[0].notificationOffice
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {item[0].notificationOffice}
                                  </p>
                                  <div
                                    className={`w-80 overflow-hidden overflow-ellipsis whitespace-nowrap ${
                                      query.sender ===
                                      item[0].notificationOffice
                                        ? "text-sky-100"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    <span className="inline">
                                      {item[0].notificationMessage}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
            </div>
          </div>
          <div className="h-full w-1/2">
            <ScrollArea>
              <div className="h-full w-full pt-20 pr-8">
                <div className="prose py-8 opacity-0">
                  <h1>X</h1>
                </div>
                <div className="w-4/5">
                  {query.sender === "Collecting" &&
                    messageCollecting.map((item, index) => (
                      <SingleMessage key={index} item={item} />
                    ))}
                  {query.sender === "Registrar" &&
                    messageRegistrar.map((item, index) => (
                      <SingleMessage key={index} item={item} />
                    ))}
                  {query.sender === "Department" &&
                    messageDepartment.map((item, index) => (
                      <SingleMessage key={index} item={item} />
                    ))}
                  {query.sender === "Affairs" &&
                    messageAffairs.map((item, index) => (
                      <SingleMessage key={index} item={item} />
                    ))}
                  {query.sender === "Library" &&
                    messageLibrary.map((item, index) => (
                      <SingleMessage key={index} item={item} />
                    ))}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });
  if (session) {
    if (query.id !== session.id) {
      return {
        notFound: true,
      };
    }
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
