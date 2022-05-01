import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import TopBar from "../../../../components/TopBar";
import { useState } from "react";
import RandExp from "randexp";
import Spinner from "../../../../components/extras/Spinner";
import emailjs from "@emailjs/browser";
import { useRouter } from "next/router";
import { CheckCircleIcon } from "@heroicons/react/solid";
import axios from "axios";
import Link from "next/link";

export default function SetUp({ session }) {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [inputOTP, setInputOTP] = useState("");
  const [confirmationCode, setConfirmationCode] = useState(
    new RandExp(/[\d]{6}/).gen()
  );
  const [match, setMatch] = useState(false);

  const handleCompare = async () => {
    if (inputOTP.length > 5 && confirmationCode == inputOTP) {
      setIsFetching(true);
      const { data } = await axios.post("/api/account/security/set2fac", {
        email,
        adminid: session.id,
        action: router.query.action,
      });
      if (data.message === "OK") {
        setIsFetching(false);
        return setMatch(true);
      }
    }
    setMatch(false);
    console.log(confirmationCode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsFetching(true);
    emailjs
      .sendForm(
        "service_tib5f2z",
        "template_n3qcedh",
        event.target,
        "TA5Tv9vbUY2nsgarb"
      )
      .then(
        (result) => {
          if (result.text === "OK") {
            setIsFetching(false);
            setEmailSent(true);
          }
        },
        (error) => {
          setIsFetching(false);
          console.log(error.text);
        }
      );
  };

  const handleDisable = async () => {
    setIsFetching(true);
    const { data } = await axios.post("/api/account/security/set2fac", {
      email: null,
      adminid: session.id,
      action: router.query.action,
    });
    if (data.message === "OK") {
      setIsFetching(false);
      router.back();
    }
  };

  return (
    <div>
      <Head>
        <title>Two-Factor Authentication - Setup</title>
      </Head>
      <TopBar />
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-fit w-full max-w-xs rounded-lg bg-white px-8 py-4 shadow">
          {router.query.action === "enable" ? (
            <>
              <div className="flex w-full justify-center">
                <div className="relative h-12 w-12">
                  <Image
                    src="/assets/icons/authentication.png"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              {emailSent ? (
                <>
                  <div className="flex w-full justify-center text-xl text-black">
                    {match ? "Success!" : "Enter the code"}
                  </div>
                  <div className="flex w-full text-center text-xs text-gray-500">
                    {match ? (
                      <div className="w-full">
                        <div className="mt-8 flex w-full justify-center">
                          <CheckCircleIcon className="h-16 w-16 text-green-500" />
                        </div>
                        <div className="mt-4 flex justify-center text-sm text-blue-500">
                          <span className="cursor-pointer  hover:underline">
                            <Link href="/">Go to home</Link>
                          </span>
                        </div>
                      </div>
                    ) : (
                      "A message with the confirmation code has been sent to your email."
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex w-full justify-center text-xl text-black">
                    Help protect your account
                  </div>
                  <div className="flex w-full text-center text-xs text-gray-500">
                    If we notice an attempted login from a device or browser we
                    don&apos;t recognize,&nbsp;we&apos;ll ask for a verification
                    code.
                  </div>
                </>
              )}
              {isFetching ? (
                <div className="my-8 flex w-full justify-center">
                  <Spinner color="bg-blue-500/50" />
                </div>
              ) : match ? (
                <></>
              ) : emailSent ? (
                <div className="mt-8 w-full">
                  <input
                    maxLength={6}
                    type="text"
                    name="confirm"
                    id="confirm"
                    value={inputOTP}
                    onKeyUp={handleCompare}
                    onChange={(event) => {
                      setInputOTP(event.target.value);
                    }}
                    className={`w-full rounded-lg border-gray-500 text-sm text-black focus:ring-2 focus:ring-blue-100${
                      inputOTP.length > 5 &&
                      !match &&
                      "focus:border-red-500 focus:ring-red-300"
                    }`}
                    placeholder=""
                  />
                  <div className="mt-4 flex justify-center text-sm text-blue-500">
                    or&nbsp;
                    <span
                      className="cursor-pointer  hover:underline"
                      onClick={() => router.back()}
                    >
                      Change email
                    </span>
                  </div>
                </div>
              ) : (
                <div className="mt-8 w-full">
                  <form onSubmit={handleSubmit}>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="w-full rounded-lg border-gray-500 text-sm focus:ring-2 focus:ring-blue-300"
                      placeholder="Email"
                    />
                    <input
                      type="hidden"
                      name="to_name"
                      id="to_name"
                      value={session.firstname}
                    />
                    <input
                      type="hidden"
                      name="confirmation_code"
                      id="confirmation_code"
                      value={confirmationCode}
                    />
                    <button
                      type="submit"
                      className="mt-4 w-full rounded-lg bg-blue-400 py-2 text-sm text-white shadow hover:bg-blue-600 focus:border-none"
                    >
                      Send confirmation code
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex w-full justify-center">
                <div className="relative h-12 w-12">
                  <Image
                    src="/assets/icons/warning.png"
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div className="flex w-full text-center text-xl text-black">
                Disable two-factor authentication?
              </div>
              <div className="flex w-full text-center text-xs text-gray-500">
                Doing this will make your account less secure.
              </div>
              <button
                onClick={handleDisable}
                className="mt-8 w-full rounded-lg bg-red-600 py-2 text-sm text-white shadow hover:bg-red-400 focus:border-none"
              >
                Disable
              </button>
              <div className="mt-4 flex justify-center text-sm text-blue-500">
                or&nbsp;
                <span
                  className="cursor-pointer  hover:underline"
                  onClick={() => router.back()}
                >
                  Go back to settings
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const session = await getSession({ req });

  if (session) {
    const { role } = session;
    if (
      role === "Admin" &&
      (query.action === "enable" || query.action === "disable")
    ) {
      return {
        props: {
          session,
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
