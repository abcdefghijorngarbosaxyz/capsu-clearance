import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <meta name="description" content="404"></meta>
      </Head>
      <div className="flex h-screen w-screen flex-col items-center justify-center space-y-8">
        <div className="flex h-1/2 w-screen max-w-md flex-col rounded-lg bg-white shadow-lg dark:bg-gray-800">
          <div className="relative flex h-9 w-full items-center pl-3">
            <div className="flex h-full items-center space-x-2">
              <div className="close h-3 w-3 rounded-full"></div>
              <div className="minimize h-3 w-3 rounded-full"></div>
              <div className="maximize h-3 w-3 rounded-full"></div>
            </div>
            <div className="absolute -ml-11 w-screen max-w-md translate-x-1/2 text-sm text-gray-500">
              <h1>Error 404</h1>
            </div>
          </div>
          <div className="h-1 w-full border-t-2 border-t-gray-100 dark:border-t-gray-900"></div>
          <div className="flex h-full w-full items-center justify-center">
            <h1 className="text-4xl text-gray-700 dark:text-gray-300">
              Page Not Found
            </h1>
          </div>
        </div>
        <div className="items-center justify-center px-8">
          <h1>
            The page you are trying to reach does not exist on this website.
            Click
            <span className="text-sky-500">
              <Link href="/"> here </Link>
            </span>
            to go back.
          </h1>
        </div>
      </div>
    </>
  );
}
