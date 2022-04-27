import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import TopBar from "../../../../components/TopBar";
import Image from "next/image";
import axios from "axios";
import Spinner from "../../../../components/extras/Spinner";
import SideBarDean from "../../../../components/SideBar.Dean";

export default function Settings({
  course,
  session,
  cloudinaryapi,
  uploadpreset,
}) {
  const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");

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
  return (
    <>
      <div className="flex h-screen w-screen pt-20">
        <Head>
          <title>Settings | {course.short} - Dean&apos;s Office</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4 min-w-fit">
          <SideBarDean
            path={`/admin/dean/${session.department.toLowerCase()}/settings`}
            session={session}
            course={course}
          />
        </div>
        <div className="h-full w-3/4 px-8">
          <div className="prose prose-slate py-8 dark:prose-invert">
            <h1>Settings</h1>
          </div>
          <div className="flex w-full">
            <div className="h-fit w-full space-y-4 rounded-lg bg-gradient-to-r from-violet-400 to-violet-600 p-4 text-white shadow">
              <div className="h-fit w-full border-b border-gray-300/50 pb-8">
                <div className="space-y-4">
                  <h3 className="mb-4 flex w-full items-center font-bold">
                    <span className="w-1/6">Personal Info</span>
                    <span className="text-xs font-normal text-gray-100">
                      Changes made will be implemented once you sign in again.
                    </span>
                  </h3>
                  <div className="flex h-fit w-full">
                    <div className="w-1/6"></div>
                    <div className="flex w-1/4 items-center">Profile Photo</div>
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
                            <label className="absolute left-1" htmlFor="upload">
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
            </div>
          </div>
        </div>
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
  const cloudinaryapi = process.env.CLOUDINARY_API;
  const uploadpreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (session) {
    const { role, department } = session;
    if (role === "Admin") {
      if (department.toLowerCase() === query.course) {
        var sessionCourse;
        for (var i in courses) {
          if (query.course === courses[i].short.toLowerCase())
            sessionCourse = courses[i];
        }
        return {
          props: {
            course: sessionCourse,
            session,
            cloudinaryapi,
            uploadpreset,
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
