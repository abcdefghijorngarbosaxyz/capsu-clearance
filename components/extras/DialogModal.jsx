import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useState } from "react";

export default function DialogModal({
  open,
  type,
  sendModalState,
  submitAction,
  title,
  body,
  close,
  flash,
  children,
  submitButton,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 ${
          open ? "opacity-100" : "opacity-0"
        } pointer-events-none items-center justify-center bg-gray-900/50 transition-all duration-300`}
      />
      <Transition appear show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => sendModalState(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {type === "custom" ? (
                <div className="inline-block w-full max-w-md transform overflow-hidden align-middle transition-all">
                  {children}
                </div>
              ) : (
                <div className="my-8 inline-block w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-900">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    {title}
                  </Dialog.Title>
                  <div className="mt-2">
                    {type === "flash" && (
                      <h1 className="flex h-fit w-full justify-center p-8 text-6xl font-bold text-gray-900 dark:text-white">
                        {flash}
                      </h1>
                    )}
                    {type === "warning" && (
                      <div className="flex h-fit w-full justify-center py-4">
                        <div className="relative h-16 w-16">
                          <Image
                            src="/assets/icons/warning.png"
                            layout="fill"
                            objectFit="contain"
                          />
                        </div>
                      </div>
                    )}
                    {children}
                    <p className="text-sm text-gray-400">{body}</p>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-400 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-900"
                      onClick={() => sendModalState(false)}
                    >
                      {close}
                    </button>
                    {type === "submit" && (
                      <button
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-sky-400 px-4 py-2 text-sm font-medium text-white hover:bg-sky-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:text-gray-900"
                        onClick={() => {
                          submitAction();
                          sendModalState(false);
                        }}
                      >
                        {submitButton}
                      </button>
                    )}
                    {type === "warning" && (
                      <button
                        type="button"
                        className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          submitAction();
                          sendModalState(false);
                        }}
                      >
                        {submitButton}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
