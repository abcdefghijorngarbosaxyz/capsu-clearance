import { getSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "./extras/ThemeToggle";

export default function TopBar({ children, session }) {
  return (
    <div className="fixed top-0 h-18 w-full px-4 backdrop-blur-sm md:px-8">
      <div className="flex h-full w-full items-center justify-between border-b border-gray-300/[0.5] dark:border-gray-700/[0.5]">
        <div className="h-full w-full">
          <Link href="/">
            <div className="flex h-full w-fit cursor-pointer items-center">
              <div
                className={`${
                  !session && "hidden md:flex"
                } relative flex h-14 w-14`}
              >
                <Image
                  src="/assets/capsu-logo.png"
                  layout="fill"
                  objectFit="fixed"
                />
              </div>
              <h1 className="hidden max-h-fit flex-col justify-center pl-4 font-medium text-blue-400 md:flex">
                <span className="border-b border-blue-400 text-xl">
                  CAPIZ STATE UNIVERSITY
                </span>
                <span className="pt-1 text-2xs font-extralight">
                  Center of Academic Excellence Delivering Quality Service to
                  All
                </span>
              </h1>
            </div>
          </Link>
        </div>
        <div className="mx-4 flex w-full items-center justify-end space-x-4 text-slate-700 dark:text-slate-100">
          {children}
        </div>
        <div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
