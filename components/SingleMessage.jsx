import moment from "moment";
import axios from "axios";
import { useEffect } from "react";
import Image from "next/image";

export default function SingleMessage({ sender, message, date }) {
  const UTCDate = ({ dateAttr }) => {
    const messageDate = new Date(dateAttr).toUTCString();
    const messageDateUTC = new Date(messageDate);
    const nowDate = new Date();

    if (
      7 > nowDate.getDate() - messageDateUTC.getDate() > 0 &&
      nowDate.getMonth() === messageDateUTC.getMonth()
    )
      return (
        <h6>
          {moment(messageDateUTC).fromNow() +
            ", " +
            moment(messageDateUTC).format("LT")}
        </h6>
      );
    return <h6>{moment(messageDateUTC).format("lll")}</h6>;
  };
  return (
    <>
      <div className="leading-6">
        <figure className="dark:highlight-white/5 relative flex flex-col-reverse px-6">
          <p className="mt-6 text-white">{message}</p>
          <figcaption className="flex items-center space-x-4">
            <img
              src="https://pbs.twimg.com/profile_images/1344410501309030403/L2rNpO6h_400x400.jpg"
              alt="Message sender photo"
              className="h-14 w-14 flex-none rounded-full object-cover"
              loading="lazy"
            />
            <div className="flex-auto">
              <div className="text-base font-bold text-white">
                <span className="absolute inset-0"></span>
                {sender}
              </div>
              <div className="mt-0.5 text-sm text-white/75">
                <UTCDate dateAttr={date} />
              </div>
            </div>
          </figcaption>
        </figure>
      </div>
    </>
  );
}
