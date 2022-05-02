import axios from "axios";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import ScrollArea from "../../components/extras/ScrollArea";
import SideBarCLA from "../../components/SideBar.CLA";
import SideBarDean from "../../components/SideBar.Dean";
import SideBar from "../../components/SideBar.Registrar";
import TopBar from "../../components/TopBar";
import Spinner from "../../components/extras/Spinner";
import moment from "moment";
import platform from "platform";

export default function Settings({
  session,
  cloudinaryapi,
  course,
  uploadpreset,
}) {
  const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");
  const [twoFacEnabled, setTwoFacEnabled] = useState(false);
  const [twoFacEmail, setTwoFacEmail] = useState("");
  const [seeHistory, setSeeHistory] = useState(false);
  const [historyList, setHistoryList] = useState([]);

  const previewHandler = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (!file) return setUserPhoto("");
    reader.onload = () => {
      if (reader.readyState === 2) {
        setUserPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    setLoadingUploadPhoto(true);
    const formData = new FormData();
    formData.append("file", userPhoto);
    formData.append("upload_preset", uploadpreset);

    if (userPhoto) {
      const response = await axios.post(cloudinaryapi, formData);
      if (response) {
        const { data } = await axios.post("/api/admin/changephoto", {
          userphoto: response.data.secure_url,
          adminid: session.id,
        });
        if (data) {
          setLoadingUploadPhoto(false);
        }
      }
    }
  };

  const fetchTwoFactor = async () => {
    const { data } = await axios.post("/api/account/security/check2fac", {
      adminid: session.id,
    });
    if (data.twofactor.enabled) {
      setTwoFacEnabled(data.twofactor.enabled);
      setTwoFacEmail(data.twofactor.email);
    }
  };

  const handleSeeList = async () => {
    const { data } = await axios.post("/api/account/security/listhistory", {
      adminid: session.id,
    });
    if (data) {
      setHistoryList(data.list);
      setSeeHistory(true);
    }
  };

  useEffect(() => {
    fetchTwoFactor();
  }, []);

  return (
    <div className="flex h-screen w-screen pt-20">
      <Head>
        {course ? (
          <title>Settings | {course.short} - Dean&apos;s Office</title>
        ) : (
          <title>Settings | {session.department}</title>
        )}
      </Head>
      <TopBar />
      <div className="h-full w-1/4 min-w-fit">
        {session.office === "Registrar" ? (
          <SideBar path="/admin/registrar/settings" session={session} />
        ) : session.office === "Department" ? (
          <SideBarDean
            path={`/admin/dean/${session.department.toLowerCase()}/settings`}
            session={session}
            course={course}
          />
        ) : (
          <SideBarCLA path="/settings" session={session} />
        )}
      </div>
      <div className="h-full w-3/4">
        <ScrollArea>
          <div className="h-full w-full px-8">
            <div className="prose prose-slate py-8 dark:prose-invert">
              <h1>Settings</h1>
            </div>
            <div className="flex w-full">
              <div className="mb-8 h-fit w-full space-y-4 rounded-lg bg-white p-4 text-gray-900 shadow">
                <div className="h-fit w-full border-b border-gray-300/50 pb-8">
                  <div className="space-y-4">
                    <h3 className="mb-4 flex w-full items-center font-bold">
                      <span className="w-1/6">Personal Info</span>
                      <span className="text-xs font-normal text-gray-400">
                        Changes made will be implemented once you sign in again.
                      </span>
                    </h3>
                    <div className="flex h-fit w-full">
                      <div className="w-1/6"></div>
                      <div className="flex w-1/4 items-center">
                        Profile Photo
                      </div>
                      <div className="flex w-1/2">
                        <div className="flex w-1/2 items-center justify-start">
                          {userPhoto ? (
                            <div className="relative flex h-40 w-40 rounded-full">
                              <Image
                                src={userPhoto}
                                objectFit="cover"
                                layout="fill"
                                className="rounded-full"
                              />
                            </div>
                          ) : (
                            <div className="flex h-40 w-40 items-center justify-center rounded-full bg-violet-100/50">
                              <h1 className="text-8xl">?</h1>
                            </div>
                          )}
                        </div>
                        <div className="flex w-1/2 items-center justify-end">
                          {userPhoto ? (
                            loadingUploadPhoto ? (
                              <Spinner color="bg-violet-100" />
                            ) : (
                              <div className="flex w-1/2 justify-end space-x-4">
                                <button
                                  onClick={uploadImage}
                                  className="rounded bg-green-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 hover:bg-green-400"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setUserPhoto("")}
                                  className="rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400"
                                >
                                  Cancel
                                </button>
                              </div>
                            )
                          ) : (
                            <div className="relative h-6 rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400">
                              <label
                                className="absolute left-1"
                                htmlFor="upload"
                              >
                                Upload
                              </label>
                              <input
                                name="upload"
                                type="file"
                                accept="image/*"
                                onChange={previewHandler}
                                className="w-11 opacity-0"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-fit w-full border-b border-gray-300/50 pb-8">
                  <div className="space-y-4">
                    <h3 className="mb-4 flex w-full items-center font-bold">
                      <span className="w-1/6">Security</span>
                      <span className="text-xs font-normal text-gray-400">
                        Additional security for authentication of processes
                      </span>
                    </h3>
                    <div className="flex h-fit w-full">
                      <div className="w-1/6"></div>
                      <div className="flex w-1/4 items-center">
                        Two-factor Authentication
                      </div>
                      <div className="flex w-1/2 ">
                        <div className="flex w-3/4 justify-start text-blue-500">
                          {twoFacEnabled && (
                            <span className="hover:underline">
                              Enabled with&nbsp;
                              <Link href="#">{twoFacEmail}</Link>
                            </span>
                          )}
                        </div>
                        <div className="flex w-1/4 justify-end text-blue-500 hover:underline">
                          {twoFacEnabled ? (
                            <Link href="/account/security/2fac/setup?action=disable">
                              Disable
                            </Link>
                          ) : (
                            <Link href="/account/security/2fac/setup?action=enable">
                              Enable
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-fit w-full border-b border-gray-300/50 pb-8">
                  <div className="space-y-4">
                    <h3 className="mb-4 flex w-full items-center font-bold">
                      <span className="w-1/6">Log in</span>
                      <span className="text-xs font-normal text-gray-400">
                        Where you&apos;re logged in.
                      </span>
                    </h3>
                    <div className="flex h-fit w-full">
                      <div className="w-1/6"></div>
                      <div className="flex w-1/4 items-center">
                        Device History
                      </div>
                      <div className="flex w-1/2 items-center justify-end ">
                        <button
                          onClick={handleSeeList}
                          className="text-blue-500 hover:underline"
                        >
                          {seeHistory ? "Hide list" : "See list"}
                        </button>
                      </div>
                    </div>
                    <div className="flex h-fit w-full">
                      <div className="w-1/6"></div>
                      <div className="flex w-5/6 flex-col items-start space-y-4">
                        {historyList.length > 0 &&
                          historyList
                            .sort(
                              (min, max) =>
                                new Date(min.when) - new Date(max.when)
                            )
                            .reverse()
                            .map((item, index) => (
                              <div key={index}>
                                {item.os.toLowerCase().includes("mac") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/mac.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        Mac&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item.os.toLowerCase().includes("win") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/windows.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        Windows PC&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item.os.toLowerCase().includes("android") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/android.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        {item.os}&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item.os.toLowerCase().includes("ios") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/iphone.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        {item.os}&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item.os.toLowerCase().includes("linux") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/linux.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        Linux&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {item.os.toLowerCase().includes("unkown") && (
                                  <div className="flex w-full items-center text-sm">
                                    <div className="relative h-6 w-6">
                                      <Image
                                        src="/assets/icons/devices/unkown.png"
                                        layout="fill"
                                        objectFit="cover"
                                      />
                                    </div>
                                    <div className="ml-2">
                                      <div className="flex">
                                        Device type unkown&nbsp;&middot;&nbsp;
                                        <div className="group relative">
                                          <span>{item.location}</span>
                                          <span className="absolute -top-8 left-2 hidden w-fit flex-col justify-start group-hover:flex">
                                            <span className="relative top-2 rounded bg-blue-500 px-2 py-1 text-xs text-white">
                                              {item.ipaddr}
                                            </span>
                                            <svg
                                              width="8"
                                              height="8"
                                              className="ml-2 mt-1 rotate-180 fill-blue-500"
                                            >
                                              <polygon points="5 0, 8 8, 0 10" />
                                            </svg>
                                          </span>
                                        </div>
                                      </div>
                                      <div className="text-gray-500">
                                        {item.browser}&nbsp;&middot;&nbsp;
                                        {index === 0 ? (
                                          <span className="font-semibold text-green-500">
                                            Active Now
                                          </span>
                                        ) : (
                                          moment(new Date(item.when)).format(
                                            "MMMM D [at] h:mm A"
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });
  const cloudinaryapi = process.env.CLOUDINARY_API;
  const uploadpreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  const courses = [
    { name: "Computer Science", short: "BSCS", alt: "computerscience" },
    { name: "Elementary Education", short: "BEED", alt: "education" },
    { name: "Fisheries", short: "BSF", alt: "fisheries" },
    { name: "Criminology", short: "BSCrim", alt: "criminology" },
    { name: "Food Technology", short: "BSFT", alt: "foodtech" },
  ];
  if (session) {
    const { role, department } = session;
    if (role === "Admin" && query.user === "Admin") {
      var sessionCourse = null;
      for (var i in courses) {
        if (department === courses[i].short) sessionCourse = courses[i];
      }
      return {
        props: {
          course: sessionCourse,
          session,
          cloudinaryapi,
          uploadpreset,
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
        notFound: true,
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
