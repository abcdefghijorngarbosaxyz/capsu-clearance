import { CheckCircleIcon } from "@heroicons/react/solid";
import { getSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import RandExp from "randexp";
import { useState, useEffect } from "react";
import TopBar from "../../../../components/TopBar";
import emailjs from "@emailjs/browser";

export default function VerifyTwoFactor({ session }) {
  const router = useRouter();
  const [confirmationCode, setConfirmationCode] = useState(
    new RandExp(/[\d]{6}/).gen()
  );
  const [match, setMatch] = useState(false);
  const [inputOTP, setInputOTP] = useState("");
  const [remember, setRemember] = useState(false);

  const handleCompare = async () => {
    if (inputOTP.length > 5 && confirmationCode == inputOTP) {
      setMatch(true);
      if (remember) localStorage.setItem(session.username, "rd");
      if (session.office !== "Department") {
        router.push("/admin/" + session.department.toLowerCase());
        return setMatch(true);
      }
      if (session.office === "Department") {
        router.push("/admin/dean/" + session.department.toLowerCase());
        return setMatch(true);
      }
    }
    setMatch(false);
    console.log(confirmationCode);
  };

  const sendVerificationCode = async () => {
    emailjs
      .send(
        "service_tib5f2z",
        "template_n3qcedh",
        {
          to_name: session.firstname,
          email: router.query.email,
          confirmation_code: confirmationCode,
        },
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
  useEffect(() => {
    //sendVerificationCode();
  });
  return (
    <div>
      <Head>
        <title>Verify</title>
      </Head>
      <TopBar />
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="h-fit w-full max-w-xs rounded-lg bg-white px-8 py-4 shadow">
          <div className="flex w-full justify-center">
            <div className="relative h-12 w-12">
              <Image
                src="/assets/icons/authentication.png"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>
          <div className="flex w-full justify-center text-xl text-black">
            {match ? "Success!" : "Two-factor authentication"}
          </div>
          <div className="flex w-full text-center text-xs text-gray-500">
            {match ? (
              <div className="w-full">
                <div className="mt-8 flex w-full justify-center">
                  <CheckCircleIcon className="h-16 w-16 text-green-500" />
                </div>
              </div>
            ) : (
              "A message with the confirmation code has been sent to your email."
            )}
          </div>
          {!match && (
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
              <div className="mt-4 ml-2 flex h-fit items-center">
                <input
                  onClick={(event) => setRemember(event.target.checked)}
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  value={remember}
                  className="h-4 w-4 rounded border-gray-500 bg-transparent text-sky-500 focus:outline-sky-500 focus:ring-transparent focus:ring-offset-transparent"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm font-semibold text-sky-500"
                >
                  Remember this device
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/signin",
      },
    };
  } else {
    return {
      props: {
        session,
      },
    };
  }
};
