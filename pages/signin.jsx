import Head from "next/head";
import { Listbox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  SelectorIcon,
  UserCircleIcon,
  EyeIcon,
  EyeOffIcon,
  LockClosedIcon,
} from "@heroicons/react/outline";
import { Fragment, useEffect, useState } from "react";
import { getSession, getCsrfToken, signIn } from "next-auth/react";
import Spinner from "../components/extras/Spinner";
import { useRouter } from "next/router";
import TopBar from "../components/TopBar";
import Image from "next/image";

const roles = [{ name: "Student" }, { name: "Admin" }];

export default function Signin({ csrfToken }) {
  const error = useRouter().query.error;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState(roles[0]);
  const [isReveal, setIsReveal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isPersist, setPersist] = useState(false);
  const [isFetching, setFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage(error);
  }, [error]);

  const SignInError = ({ error }) => {
    const errorMsg =
      error === "CredentialsSignin"
        ? "Username or password incorrect"
        : errorMessage;
    return <div>{errorMsg}</div>;
  };

  const submit = async (event) => {
    event.preventDefault();
    if (username === "" && password === "")
      return setErrorMessage("Username and password can't be blank");
    if (username === "") return setErrorMessage("Username can't be blank");
    if (password === "") return setErrorMessage("Password can't be blank");
    setFetching(true);
    setErrorMessage("");
    await signIn("credentials", {
      username,
      password,
      csrfToken,
      role: selectedRole.name,
      persist: isPersist,
    });
    setFetching(false);
  };

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>

      <TopBar />
      <div className="flex min-h-screen w-screen items-center justify-center md:justify-start md:px-24">
        <div className="h-fit w-full max-w-lg p-8">
          <div className="flex h-fit w-full flex-col justify-start pb-4">
            <div>
              <h3 className="text-sm font-medium text-gray-400">
                HELLO, WELCOME
              </h3>
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
                Sign in to continue
                <span className="h-fit text-6xl text-sky-500">.</span>
              </h1>
            </div>
          </div>
          <div className="my-6 flex h-fit w-full items-center justify-center rounded-md md:pr-20">
            {isFetching && (
              <div className="mb-2">
                <Spinner color="bg-sky-500/20" />
              </div>
            )}
            {errorMessage && (
              <div className="flex h-10 w-full items-center justify-center p-0">
                <h3 className="font-semibold text-red-500">
                  <SignInError error={errorMessage} />
                </h3>
              </div>
            )}
          </div>
          <div className="md:pr-20">
            <form
              onKeyDown={() => setErrorMessage("")}
              onKeyUp={() => {
                if (password.length > 0) setIsTyping(true);
                else setIsTyping(false);
              }}
            >
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username or ID Number"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className={`${
                      errorMessage === "Username can't be blank" ||
                      errorMessage === "Username and password can't be blank" ||
                      errorMessage === "Username or password incorrect"
                        ? "border-red-500"
                        : "border-none"
                    } peer h-12 w-full rounded-xl bg-gray-500/[0.1] px-4 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-none focus:ring-4 focus:ring-gray-500/[0.1] focus:ring-offset-2 focus:ring-offset-sky-500 dark:text-white dark:placeholder:text-gray-500`}
                  ></input>
                  <UserCircleIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500"></UserCircleIcon>
                </div>
                <div className="relative">
                  <input
                    type={isReveal ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    className={`${
                      errorMessage === "Password can't be blank" ||
                      errorMessage === "Username and password can't be blank" ||
                      errorMessage === "Username or password incorrect"
                        ? "border-red-500"
                        : "border-none"
                    } peer h-12 w-full rounded-xl bg-gray-500/[0.1] px-4 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-400 focus:border-none focus:ring-4 focus:ring-gray-500/[0.1] focus:ring-offset-2 focus:ring-offset-sky-500 dark:text-white dark:placeholder:text-gray-500`}
                  ></input>
                  {isTyping ? (
                    isReveal ? (
                      <EyeOffIcon
                        className="absolute right-4 top-3.5 h-5 w-5 cursor-pointer text-gray-500"
                        onClick={() => setIsReveal(!isReveal)}
                      ></EyeOffIcon>
                    ) : (
                      <EyeIcon
                        className="absolute right-4 top-3.5 h-5 w-5 cursor-pointer text-gray-500"
                        onClick={() => setIsReveal(!isReveal)}
                      ></EyeIcon>
                    )
                  ) : (
                    <LockClosedIcon className="absolute right-4 top-3.5 h-5 w-5 text-gray-500"></LockClosedIcon>
                  )}
                </div>
              </div>
              <div className="flex h-16 w-full items-center">
                <div className="w-1/2 text-white">
                  <Listbox value={selectedRole} onChange={setSelectedRole}>
                    <div className="relative">
                      <Listbox.Button className="flex h-12 w-fit items-center">
                        <span className="pointer-events-none">
                          <SelectorIcon
                            className="h-5 w-5 text-sky-500"
                            aria-hidden="true"
                          />
                        </span>
                        <span className="ml-2 block truncate text-sm font-semibold text-gray-900 dark:text-gray-300">
                          {selectedRole.name}
                        </span>
                      </Listbox.Button>
                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          {roles.map((role, roleId) => (
                            <Listbox.Option
                              key={roleId}
                              className={({ active }) =>
                                `${
                                  active
                                    ? "bg-sky-100 text-gray-900"
                                    : "text-gray-900"
                                }
                          relative cursor-default select-none py-2 pl-10 pr-4`
                              }
                              value={role}
                            >
                              {({ selected, active }) => (
                                <>
                                  <span
                                    className={`${
                                      selected ? "font-medium" : "font-normal"
                                    } block truncate`}
                                  >
                                    {role.name}
                                  </span>
                                  {selected ? (
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-500">
                                      <CheckIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <div className="flex h-fit w-1/2 items-center">
                  <input
                    onClick={(event) => {
                      setPersist(event.target.checked);
                    }}
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    value={isPersist}
                    className="h-4 w-4 rounded border-gray-500 bg-transparent text-sky-500 focus:outline-sky-500 focus:ring-transparent focus:ring-offset-transparent"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm font-semibold text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <input
                name="csrfToken"
                type="hidden"
                defaultValue={csrfToken}
              ></input>
              <input
                name="role"
                type="hidden"
                value={selectedRole.name}
              ></input>
              <div className="flex h-12">
                <button
                  onClick={submit}
                  className="w-full rounded-full bg-sky-500 text-sm font-semibold text-white hover:bg-sky-600 focus:bg-sky-600 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-900"
                  type="submit"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { req } = context;
  const session = await getSession({ req });
  if (session) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }
  const csrfToken = await getCsrfToken(context);
  return {
    props: { csrfToken },
  };
};
