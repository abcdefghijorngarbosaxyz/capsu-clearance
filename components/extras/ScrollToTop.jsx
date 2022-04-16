import { ArrowUpIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";

export const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) return setVisible(true);
    return setVisible(false);
  };

  const toTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  return (
    <button
      className={`${
        visible ? "visible" : "hidden"
      } flex h-12 w-12 items-center justify-center `}
      onClick={toTop}
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  );
};
