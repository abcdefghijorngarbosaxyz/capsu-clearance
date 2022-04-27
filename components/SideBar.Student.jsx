import { PencilAltIcon } from "@heroicons/react/outline";
import Image from "next/image";
import Link from "next/link";
import ScrollArea from "./extras/ScrollArea";
import { Disclosure } from "@headlessui/react";
import { signOut } from "next-auth/react";

export default function SideBarStudent({ session, path }) {
  const currentLink = (link) => {
    if (path === link) return true;
    return false;
  };

  return (
    <ScrollArea>
      <div className="prose flex h-full w-full flex-col justify-between px-8 pt-8">
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex h-12 w-full">
            <div className="relative h-12 w-12 rounded-full bg-sky-500">
              {session.userphoto ? (
                <Image
                  src={session.userphoto}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full"
                />
              ) : (
                <h1 className="flex h-full w-full items-center justify-center text-lg font-normal text-white">
                  {session.firstname.charAt(0)}
                  {session.lastname.charAt(0)}
                </h1>
              )}
            </div>
            <div className="ml-4 flex h-full w-fit flex-col items-start">
              <h1 className="m-0 p-0 text-lg font-bold text-sky-500">
                {session.firstname}&nbsp;
                {session.lastname}
              </h1>
              <h1 className="m-0 h-fit p-0 text-xs font-normal text-gray-400">
                {session.username}, {session.department}-{session.yearlevel}
                {session.section}
              </h1>
            </div>
          </div>
          <div className="mt-4 flex h-full w-full flex-col space-y-6 border-t border-gray-300/[0.5] pt-4 dark:border-gray-700/[0.5]">
            <Link href="/student">
              <div className="group flex h-6 w-fit cursor-pointer items-center">
                <div className="relative h-6 w-6">
                  <Image src="/assets/icons/home.png" layout="fill" priority />
                </div>
                <h4
                  className={`${
                    currentLink("/student/v2")
                      ? "text-black dark:text-white"
                      : "text-slate-700 dark:text-slate-400"
                  } mb-6 pl-4 group-hover:text-black dark:group-hover:text-white `}
                >
                  Home
                </h4>
              </div>
            </Link>
            <Link href={`/student/v2/${session.id}/messages`}>
              <div className="group flex h-6 w-fit cursor-pointer items-center">
                <div className="relative h-6 w-6">
                  <Image
                    src="/assets/icons/message.png"
                    layout="fill"
                    priority
                  />
                </div>
                <h4
                  className={`${
                    currentLink("/student/v2/messages")
                      ? "text-black dark:text-white"
                      : "text-slate-700 dark:text-slate-400"
                  } mb-6 pl-4 group-hover:text-black dark:group-hover:text-white `}
                >
                  Messages
                </h4>
              </div>
            </Link>
          </div>
          <div className="flex h-full w-full items-end border-b border-gray-300/[0.5] px-4 py-4 dark:border-gray-700/[0.5] lg:px-0">
            <Link href={`/student/v2/${session.id}/editdata`}>
              <div className="group flex h-6 w-fit cursor-pointer items-center">
                <div className="relative h-6 w-6">
                  <Image
                    src="/assets/icons/settings.png"
                    layout="fill"
                    priority
                  />
                </div>
                <h4
                  className={`${
                    currentLink("/student/v2/editdata")
                      ? "text-black dark:text-white"
                      : "text-slate-700 dark:text-slate-400"
                  } mb-6 pl-4 group-hover:text-black dark:group-hover:text-white `}
                >
                  Settings
                </h4>
              </div>
            </Link>
          </div>
          <div className="flex h-fit w-full items-end pb-8 pt-4">
            <div className="group w-fit">
              <button onClick={signOut} className="flex h-6 w-fit items-center">
                <div className="relative h-6 w-6">
                  <Image
                    src="/assets/icons/logout.png"
                    layout="fill"
                    priority
                  />
                </div>
                <h4 className="mb-6 pl-4 text-slate-700 group-hover:text-black dark:text-slate-400 dark:group-hover:text-white">
                  Logout
                </h4>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
