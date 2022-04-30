import Head from "next/head";
import Spinner from "../../../components/extras/Spinner";
import TopBar from "../../../components/TopBar";
import { useState } from "react";
import {
  ArrowNarrowLeftIcon,
  AtSymbolIcon,
  LockClosedIcon,
  PaperClipIcon,
  UserCircleIcon,
} from "@heroicons/react/outline";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

export default function ResetPassword({ uploadpreset, cloudinaryapi }) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [proof, setProof] = useState("");
  const [filePlaceholder, setFilePlaceholder] = useState(
    "Attach photo of ID card or RF for authentication"
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponseMessage("");
    if (username && email && proof) setIsFetching(true);
    else return;
    const formData = new FormData();
    formData.append("file", proof);
    formData.append("upload_preset", uploadpreset);

    if (proof) {
      const response = await axios.post(cloudinaryapi, formData);
      if (response) {
        const { data } = await axios.post("/api/account/password/reset", {
          proof: response.data.secure_url,
          username,
          email,
        });
        if (data) {
          setIsFetching(false);
          setResponseMessage(
            "We will send an email to you once we review your request."
          );
        }
      }
    }
  };

  return (
    <>
      <Head>
        <title>Password Reset | Online Students&apos; Clearance System</title>
      </Head>
      <TopBar />
      <div className="flex min-h-screen w-screen items-center justify-center pt-12 md:justify-end md:px-24">
        <div className="flex h-fit w-full max-w-lg flex-col justify-end p-8">
          <div className="flex h-fit w-full flex-col items-end justify-end pb-4">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                Forgot password
                <span className="h-fit text-5xl text-sky-500">?</span>
              </h1>
            </div>
            <div>
              <h3 className="pt-4 text-sm font-medium text-gray-400">
                DON&apos;T WORRY
              </h3>
            </div>
          </div>
          <div className="my-6 flex h-fit w-full items-center justify-center rounded-md md:pl-20">
            {isFetching && (
              <div className="mb-2">
                <Spinner color="bg-sky-500/20" />
              </div>
            )}
            {responseMessage && (
              <div className="flex h-10 w-full items-center justify-center p-0">
                <h3 className="font-semibold text-yellow-400">
                  <div>{responseMessage}</div>
                </h3>
              </div>
            )}
          </div>
          <div className="md:pl-20">
            <form>
              <div className="space-y-4">
                <div className="relative">
                  <input
                    required
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username or ID Number"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={`peer h-12 w-full rounded-xl border-none bg-gray-500/[0.1] px-4 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-none focus:ring-4 focus:ring-gray-500/[0.1] focus:ring-offset-2 focus:ring-offset-sky-500 dark:text-white dark:placeholder:text-gray-500`}
                  ></input>
                  <UserCircleIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500"></UserCircleIcon>
                </div>
                <div className="relative">
                  <input
                    required
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Recovery Email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    className={`peer h-12 w-full rounded-xl border-none bg-gray-500/[0.1] px-4 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-none focus:ring-4 focus:ring-gray-500/[0.1] focus:ring-offset-2 focus:ring-offset-sky-500 dark:text-white dark:placeholder:text-gray-500`}
                  ></input>

                  <AtSymbolIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500" />
                </div>
                <div className="relative">
                  <div
                    className={`${
                      proof
                        ? "text-black dark:text-white"
                        : "text-gray-400 dark:text-gray-500"
                    } peer flex h-12 w-full cursor-pointer items-center rounded-xl border-none bg-gray-500/[0.1] px-4 py-2 text-sm font-semibold focus:border-none focus:ring-4 focus:ring-gray-500/[0.1] focus:ring-offset-2 focus:ring-offset-sky-500`}
                  >
                    {filePlaceholder}
                  </div>
                  <input
                    required
                    type="file"
                    name="proof"
                    id="proof"
                    accept="image/*"
                    onChange={(event) => {
                      setProof(event.target.files[0]);
                      setFilePlaceholder(
                        event.target.files[0]
                          ? event.target.files[0].name
                          : "Attach photo of ID card or RF for authentication"
                      );
                    }}
                    className="absolute top-0 left-0 h-full w-full cursor-pointer opacity-0"
                  />

                  <PaperClipIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500" />
                </div>
              </div>

              <div className="mt-4 flex h-12">
                <button
                  onClick={handleSubmit}
                  className="w-full rounded-full bg-sky-500 text-sm font-semibold text-white hover:bg-sky-600 focus:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                  type="submit"
                >
                  Request reset password
                </button>
              </div>
              <div className="mt-4 flex justify-center text-sm font-semibold text-blue-500 hover:underline">
                <span className="cursor-pointer" onClick={() => router.back()}>
                  or Signin
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticProps = (context) => {
  const uploadpreset = process.env.CLOUDINARY_UPLOAD_PRESET;
  const cloudinaryapi = process.env.CLOUDINARY_API;
  return {
    props: {
      uploadpreset,
      cloudinaryapi,
    },
  };
};
