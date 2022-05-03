import axios from "axios";
import Link from "next/link";
import TopBar from "../../../../../components/TopBar";
import { useState } from "react";
import Image from "next/image";
import { CheckCircleIcon, XIcon } from "@heroicons/react/solid";
import Spinner from "../../../../../components/extras/Spinner";
import { getCsrfToken, getSession, signIn } from "next-auth/react";
import Head from "next/head";

export default function RecoveryPassword({ valid, username, csrfToken }) {
  const [finished, setFinished] = useState(false);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(true);

  const handleSignin = async (event) => {
    event.preventDefault();
    await signIn("credentials", {
      username,
      password: password2,
      csrfToken,
      role: "Student",
      persist: false,
    });
  };

  const handleChange = async (event) => {
    event.preventDefault();
    setTyping(false);
    setLoading(true);
    const { data } = await axios.post("/api/account/password/recovery/change", {
      username,
      password2,
    });
    if (data) {
      setFinished(true);
    }
  };
  return (
    <>
      <Head>
        <title>
          {valid ? "Set New Password" : "Link broken or expired"}&nbsp;| Online
          Students&apos; Clearance System
        </title>
      </Head>
      <div className="flex h-screen w-full items-center justify-center">
        <TopBar />
        {valid ? (
          <div className="w-full max-w-xs rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 px-8 py-4 shadow">
            {finished ? (
              <div className="flex h-fit w-full justify-center">
                <h6>
                  Password set!{" "}
                  <button
                    onClick={handleSignin}
                    className="text-blue-900 underline"
                  >
                    Continue to home..
                  </button>
                </h6>
              </div>
            ) : (
              <>
                {" "}
                <div className="flex h-fit w-full justify-center">
                  <div className="relative h-12 w-12">
                    <Image
                      src="/assets/icons/key.png"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                </div>
                <div className="my-4 flex h-12 w-full items-center justify-center">
                  {typing && password1.length > 0 && password2.length > 0 ? (
                    password1 === password2 ? (
                      <div>
                        <span className="flex h-12 items-center space-x-2 text-sm text-green-100">
                          <CheckCircleIcon className="h-5 w-5 text-green-900" />{" "}
                          Passwords match
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="flex h-12 items-center space-x-2 text-sm text-red-100">
                          <XIcon className="h-5 w-5 text-red-900" /> Passwords
                          doesn&apos;t match
                        </span>
                      </div>
                    )
                  ) : null}
                  {loading && <Spinner color={"bg-white/50"} />}
                </div>
                <form>
                  <div>
                    <input
                      type="password"
                      name="password1"
                      id="password1"
                      minLength={5}
                      value={password1}
                      placeholder="New password"
                      onChange={(event) => setPassword1(event.target.value)}
                      className="w-full rounded-lg border-none text-black placeholder:text-sm focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password1"
                      id="password1"
                      minLength={5}
                      value={password2}
                      placeholder="Confirm new password"
                      onChange={(event) => setPassword2(event.target.value)}
                      className="mt-4 w-full rounded-lg border-none text-black placeholder:text-sm focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleChange}
                      disabled={
                        password1.length < 5 ||
                        password2.length < 5 ||
                        password1 != password2
                      }
                      type="submit"
                      className="mt-4 w-full rounded-lg bg-red-600 p-2 text-sm font-semibold text-white hover:bg-red-400"
                    >
                      Set new password
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        ) : (
          <h6>
            Link is either invalid or expired. Request a new one{" "}
            <span className="text-blue-500 hover:underline">
              <Link href="https://capsu-clearance.vercel.app/account/password/reset/">
                here
              </Link>
            </span>
            .
          </h6>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req, query } = context;
  const host =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    `${process.env.HOSTNAME}`;
  const { data } = await axios.post(
    host + "/api/account/password/recovery/checkvalid",
    {
      linkId: query.linkId,
    }
  );

  const csrfToken = await getCsrfToken(context);
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  return {
    props: {
      valid: data.valid,
      username: data.valid ? data.username : null,
      csrfToken,
    },
  };
};
