import { getSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import SideBarStudent from "../../../../components/SideBar.Student";
import TopBar from "../../../../components/TopBar";
import Image from "next/image";
import axios from "axios";
import Spinner from "../../../../components/extras/Spinner";

export default function StudentV2EditData({
  session,
  cloudinaryapi,
  uploadpreset,
  uploadpresetsignature,
}) {
  const [yearEdit, setYearEdit] = useState(false);
  const [sectionEdit, setSectionEdit] = useState(false);
  const [year, setYear] = useState(session.yearlevel);
  const [section, setSection] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingUploadPhoto, setLoadingUploadPhoto] = useState(false);
  const [loadingUploadSignature, setLoadingUploadSignature] = useState(false);
  const [userPhoto, setUserPhoto] = useState("");
  const [signature, setSignature] = useState("");

  const handleSaveSection = async (event) => {
    event.preventDefault();
    if (section == session.section) return setSectionEdit(false);
    setLoading(true);
    const { data } = await axios.post("/api/student/request", {
      requestId: session.id,
      reason: "Change section",
      data: { year, section },
      course: session.department,
      name:
        session.firstname +
        " " +
        session.middlename.charAt(0) +
        ". " +
        session.lastname,
    });
    if (data) {
      setLoading(false);
      setSectionEdit(false);
    }
  };

  const handleSaveYear = async (event) => {
    event.preventDefault();
    if (year == session.yearlevel) return setYearEdit(false);
    setLoading(true);
    const { data } = await axios.post("/api/student/request", {
      requestId: session.id,
      reason: "Change year level",
      data: { year, section },
      course: session.department,
      name:
        session.firstname +
        " " +
        session.middlename.charAt(0) +
        ". " +
        session.lastname,
    });
    if (data) {
      setLoading(false);
      setYearEdit(false);
    }
  };

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
        const { data } = await axios.post("/api/student/changephoto", {
          userphoto: response.data.secure_url,
          studentid: session.id,
        });
        if (data) {
          setLoadingUploadPhoto(false);
        }
      }
    }
  };

  const previewHandlerSignature = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (!file) return setSignature("");
    reader.onload = () => {
      if (reader.readyState === 2) {
        setSignature(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const uploadImageSignature = async () => {
    setLoadingUploadSignature(true);
    const formData = new FormData();
    formData.append("file", signature);
    formData.append("upload_preset", uploadpresetsignature);

    if (signature) {
      const response = await axios.post(cloudinaryapi, formData);
      if (response) {
        const { data } = await axios.post("/api/student/changesignature", {
          signature: response.data.secure_url,
          studentid: session.id,
        });
        if (data) {
          setLoadingUploadSignature(false);
        }
      }
    }
  };
  return (
    <>
      <div className="flex h-screen w-screen pt-20">
        <Head>
          <title>{session.firstname} - Settings | Student</title>
        </Head>
        <TopBar />
        <div className="h-full w-1/4 min-w-fit">
          <SideBarStudent path="/student/v2/editdata" session={session} />
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
                  <div className="flex h-fit w-full">
                    <div className="w-1/6"></div>
                    <div className="flex w-1/4 items-center">Signature</div>
                    <div className="flex w-1/2">
                      <div className="flex w-1/2 items-center justify-start">
                        {signature ? (
                          <div className="relative flex h-36 w-96 rounded-lg bg-white">
                            <Image
                              src={signature}
                              objectFit="contain"
                              layout="fill"
                            />
                          </div>
                        ) : (
                          <div className="flex h-36 w-96 items-center justify-center rounded-lg bg-violet-100/50">
                            <h1 className="text-8xl">?</h1>
                          </div>
                        )}
                      </div>
                      <div className="flex w-1/2 items-center justify-end">
                        {signature ? (
                          loadingUploadSignature ? (
                            <Spinner color="bg-violet-100" />
                          ) : (
                            <div className="flex w-1/2 justify-end space-x-4">
                              <button
                                onClick={uploadImageSignature}
                                className="rounded bg-green-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 hover:bg-green-400"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setSignature("")}
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
                              onChange={previewHandlerSignature}
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
                    <span className="w-1/6">Student Data</span>
                    {loading ? (
                      <Spinner color="bg-violet-100" />
                    ) : (
                      <span className="text-xs font-normal text-gray-100">
                        Changes made will be sent to your Deans&apos; Office for
                        review and will be implemented once accepted.
                      </span>
                    )}
                  </h3>
                  <div className="flex h-fit w-full">
                    <div className="w-1/6"></div>
                    <div className="w-1/4">Year Level</div>
                    <div className="w-1/2">
                      {yearEdit ? (
                        <form onSubmit={handleSaveYear} className="flex">
                          <div className="flex w-1/2 justify-end">
                            <input
                              required
                              id="section-input"
                              maxLength={1}
                              onChange={(event) => setYear(event.target.value)}
                              defaultValue={session.yearlevel}
                              className="text-md w-12 rounded border-none bg-white py-0 px-1 text-black"
                              type="text"
                            />
                          </div>
                          <div className="flex w-1/2 justify-end space-x-4">
                            <button
                              type="submit"
                              className="rounded bg-green-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 hover:bg-green-400"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setYearEdit(false)}
                              className="rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex">
                          <div className="flex w-1/2 justify-end">
                            {session.yearlevel}
                          </div>
                          <div className="flex w-1/2 justify-end">
                            <button
                              onClick={() => {
                                setYearEdit(true);
                                setSectionEdit(false);
                                setSection("");
                              }}
                              type="submit"
                              className="rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400"
                            >
                              Edit
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex h-fit w-full items-center">
                    <div className="w-1/6"></div>
                    <div className="w-1/4">Section</div>
                    <div className="w-1/2">
                      {sectionEdit ? (
                        <form onSubmit={handleSaveSection} className="flex">
                          <div className="flex w-1/2 justify-end">
                            <input
                              required
                              id="section-input"
                              maxLength={1}
                              onChange={(event) =>
                                setSection(event.target.value)
                              }
                              defaultValue={session.section}
                              className="text-md w-12 rounded border-none bg-white py-0 px-1 text-black"
                              type="text"
                            />
                          </div>
                          <div className="flex w-1/2 justify-end space-x-4">
                            <button
                              type="submit"
                              className="rounded bg-green-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-green-300 hover:bg-green-400"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setSectionEdit(false)}
                              className="rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="flex">
                          <div className="flex w-1/2 justify-end">
                            {session.section}
                          </div>
                          <div className="flex w-1/2 justify-end">
                            <button
                              onClick={() => {
                                setSectionEdit(true);
                                setYearEdit(false);
                                setYear("");
                              }}
                              type="submit"
                              className="rounded bg-violet-500 px-2 py-0 ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-violet-300 hover:bg-violet-400"
                            >
                              Edit
                            </button>
                          </div>
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
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });
  const cloudinaryapi = process.env.CLOUDINARY_API;
  const uploadpreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const uploadpresetsignature = process.env.CLOUDINARY_UPLOAD_PRESET_SIGNATURE;
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
          session,
          cloudinaryapi,
          uploadpreset,
          uploadpresetsignature,
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
