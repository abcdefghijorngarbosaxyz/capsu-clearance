import Head from "next/head";
import { useState, Fragment, useEffect } from "react";
import TopBar from "../../../components/TopBar";
import { Combobox, Transition, Listbox } from "@headlessui/react";
import {
  SelectorIcon,
  CheckIcon,
  XIcon,
  EyeOffIcon,
  EyeIcon,
  EmojiSadIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import $ from "jquery";
import RandExp from "randexp";
import DialogModal from "../../../components/extras/DialogModal";
import axios from "axios";
import SideBar from "../../../components/SideBar.Registrar";
import { getSession } from "next-auth/react";

const courses = [
  { id: 1, name: "BS in Criminology", alt: "BSCrim" },
  { id: 2, name: "BS in Computer Science", alt: "BSCS" },
  { id: 3, name: "BS in Food Technology", alt: "BSFT" },
  { id: 4, name: "B of Elementary Education", alt: "BEED" },
  { id: 5, name: "BS in Fisheries", alt: "BSF" },
];

const yearlevels = [
  { name: "1st year", value: 1 },
  { name: "2nd year", value: 2 },
  { name: "3rd year", value: 3 },
  { name: "4th year", value: 4 },
];

export default function AddNewStudent({ session, endpoint, period }) {
  const [studentid, setStudentid] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [middlename, setMiddlename] = useState("");
  const [lastname, setLastname] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(courses[0]);
  const [selectedYearlevel, setSelectedYearlevel] = useState(yearlevels[0]);

  const [courseQuery, setCourseQuery] = useState("");
  const [studentidError, setStudentidError] = useState("");
  const [passwdModalOpen, setPasswdModalOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);
  const [isReveal, setIsReveal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const filterCourses =
    courseQuery === ""
      ? courses
      : courses.filter((course) =>
          course.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(courseQuery.toLowerCase().replace(/\s+/g, ""))
        );

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    if (studentidError === "invalid") return;
    try {
      await axios.post("/api/admin/registrar/newstudent", {
        username: studentid,
        password,
        firstname,
        middlename,
        lastname,
        department: selectedCourse.alt,
        yearlevel: selectedYearlevel.value,
      });
      setAlertModalOpen(true);
    } catch (error) {
      setErrorMessage("ID Number already exists in the database");
      setAlertModalOpen(true);
    }
  };

  const sendPasswdModalState = (passwdModalOpen) => {
    setPasswdModalOpen(passwdModalOpen);
  };

  const sendAlertModalState = (alertModalOpen) => {
    setAlertModalOpen(alertModalOpen);
  };

  const generatePassword = () => {
    var newpassword = new RandExp(/[a-z\d]{2}[-][a-z\d]{3}/).gen();
    $("#password").val(newpassword);
    setPassword(newpassword);
  };

  const validateStudentId = () => {
    const validation = /[2][0][\d]{2}[-][\d]{6}/g;
    if (studentid.length === 0) return setStudentidError(null);
    if (validation.test(studentid)) setStudentidError("valid");
    else setStudentidError("invalid");
  };

  useEffect(() => {
    $("#studentid").val(new Date().getFullYear() + "-");
  }, []);

  return (
    <div className="flex h-screen w-screen pt-20">
      <Head>
        <title>Add New Student | Registrar</title>
      </Head>
      <TopBar />
      <div className="h-full w-1/4">
        <SideBar path="/admin/registrar/newstudent" session={session} />
      </div>
      <div className="h-full w-3/4 px-8">
        <div className="prose prose-slate py-8 dark:prose-invert">
          <h1>Add new student</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid h-fit w-full grid-cols-6 gap-4 rounded-lg bg-gradient-to-r from-sky-400 to-sky-600 p-4 text-gray-900 backdrop-blur"
        >
          <div className="col-span-1">
            <label
              htmlFor="studentid"
              className="block text-sm font-medium text-white"
            >
              Student ID
            </label>
            <input
              maxLength={11}
              required
              type="text"
              name="studentid"
              id="studentid"
              autoComplete="none"
              placeholder="2022-123456"
              onChange={(event) => setStudentid(event.target.value)}
              onKeyUp={validateStudentId}
              className="mt-1 block w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500  focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
            />
          </div>
          <div className="col-span-5 mt-8">
            <div className="text-sm">
              {studentidError ? (
                studentidError === "valid" ? (
                  <h3 className="flex items-center space-x-2 text-white">
                    <span className="rounded-full bg-green-600 p-1">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    <span>ID Number is valid</span>
                  </h3>
                ) : (
                  <h3 className="flex items-center space-x-2 text-white">
                    <span className="rounded-full bg-red-600 p-1">
                      <XIcon className="h-4 w-4" />
                    </span>
                    <span>ID Number is not valid</span>
                  </h3>
                )
              ) : null}
            </div>
          </div>
          <div className="col-span-2">
            <label
              htmlFor="first-name"
              className="block text-sm font-medium text-white"
            >
              First name
            </label>
            <input
              required
              type="text"
              name="first-name"
              id="first-name"
              autoComplete="given-name"
              placeholder="Juan"
              onChange={(event) => setFirstname(event.target.value)}
              className="mt-1 block w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500  focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="middle-name"
              className="block text-sm font-medium text-white"
            >
              Middle name
            </label>
            <input
              required
              type="text"
              name="middle-name"
              id="middle-name"
              autoComplete="middle-name"
              placeholder="Dela"
              onChange={(event) => setMiddlename(event.target.value)}
              className="mt-1 block  w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="last-name"
              className="block text-sm font-medium text-white"
            >
              Last name
            </label>
            <input
              required
              type="text"
              name="last-name"
              id="last-name"
              autoComplete="family-name"
              placeholder="Cruz"
              onChange={(event) => setLastname(event.target.value)}
              className="mt-1  block w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
            />
          </div>
          <div className="col-span-2">
            <label
              htmlFor="department"
              className="block text-sm font-medium text-white"
            >
              Course
            </label>
            <Combobox
              value={selectedCourse}
              onChange={setSelectedCourse}
              name="department"
              id="department"
            >
              <div className="relative mt-1">
                <div className="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                  <Combobox.Input
                    className="w-full rounded-md border-2 border-transparent pl-3 pr-10 text-sm leading-5 text-gray-900 focus:border-sky-500 focus:ring-sky-500"
                    displayValue={(course) => course.name}
                    onChange={(event) => setCourseQuery(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setCourseQuery("")}
                >
                  <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filterCourses.length === 0 && courseQuery !== "" ? (
                      <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Course not found.
                      </div>
                    ) : (
                      filterCourses.map((course) => (
                        <Combobox.Option
                          key={course.id}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active ? "bg-sky-600 text-white" : "text-gray-900"
                            }`
                          }
                          value={course}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selected ? "font-medium" : "font-normal"
                                }`}
                              >
                                {course.name}
                              </span>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-sky-600"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className="col-span-4">
            <label
              htmlFor="yearlevel"
              className="block text-sm font-medium text-white"
            >
              Year Level
            </label>
            <Listbox
              value={selectedYearlevel}
              onChange={setSelectedYearlevel}
              name="yearlevel"
              id="yearlevel"
            >
              <div className="relative mt-1">
                <Listbox.Button className="relative w-1/4 cursor-default rounded-md border-2 border-transparent bg-white py-2 pl-3 pr-10 text-left text-sm shadow-md focus:outline-none focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300">
                  <span className="block truncate">
                    {selectedYearlevel.name}
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <SelectorIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute mt-1 max-h-60 w-1/4 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {yearlevels.map((level, levelId) => (
                      <Listbox.Option
                        key={levelId}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-sky-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={level}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {level.name}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-sky-600"
                                }`}
                              >
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
          <div className="relative col-span-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white"
            >
              Password
            </label>
            <input
              required
              type={isReveal ? "text" : "password"}
              name="password"
              id="password"
              placeholder="a1-b2c"
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 block w-full rounded-md border-transparent placeholder:text-gray-300 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300 sm:text-sm"
            />
            {isReveal ? (
              <EyeOffIcon
                className="absolute right-2 top-8 h-5 w-5 cursor-pointer text-gray-400"
                onClick={() => setIsReveal(!isReveal)}
              ></EyeOffIcon>
            ) : (
              <EyeIcon
                className="absolute right-2 top-8 h-5 w-5 cursor-pointer text-gray-400"
                onClick={() => setIsReveal(!isReveal)}
              ></EyeIcon>
            )}
          </div>
          <div className="col-span-2 mt-5">
            <button
              type="button"
              onClick={() => {
                setPasswdModalOpen(true);
                generatePassword();
              }}
              className="mt-1 rounded-md border border-transparent bg-cyan-400 p-2 text-sm text-cyan-900 hover:bg-cyan-600 focus:border-sky-500 focus:outline-none focus:ring-sky-500 focus-visible:border-sky-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-sky-300"
            >
              Generate password
            </button>
          </div>{" "}
          <div className="col-span-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-sky-400 py-2 px-4 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
      <DialogModal
        type="flash"
        open={passwdModalOpen}
        title="New password generated"
        flash={password}
        body="Please show the generated password to the student before saving the data."
        sendModalState={sendPasswdModalState}
        close="OK"
      />
      <DialogModal
        type="flash"
        flash={
          errorMessage ? (
            <EmojiSadIcon className="h-20 w-20 text-red-500" />
          ) : (
            <EmojiHappyIcon className="h-20 w-20 text-green-500" />
          )
        }
        open={alertModalOpen}
        title={errorMessage ? "An error occured" : "Success"}
        body={
          errorMessage
            ? "Please check if the student information are correct and there are no fields that are empty"
            : "New student added"
        }
        sendModalState={sendAlertModalState}
        close={errorMessage ? "Retry" : "OK"}
      />
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { req, res } = context;
  const session = await getSession({ req });
  const host =
    (process.env.NODE_ENV === "development" ? "http://" : "https://") +
    `${process.env.HOSTNAME}`;
  const { data: period } = await axios.get(host + "/api/getperiod");
  if (session) {
    const { role, department } = session;
    if (role === "Admin" && department === "Registrar") {
      return {
        props: {
          endpoint: process.env.SOCKETIO_ENDPOINT,
          session,
          period: period.period,
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
