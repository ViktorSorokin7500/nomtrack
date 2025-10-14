"use client";

import toast from "react-hot-toast";
import { SHARED_TEXTS } from "./(texts)/shared-text";

export function HelpCopy() {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(SHARED_TEXTS.COPY.EMAIL);
      toast.success(SHARED_TEXTS.COPY.TOAST_SUCCESS);
    } catch (err) {
      toast.error(SHARED_TEXTS.COPY.TOAST_ERROR);
      console.error(err);
    }
  };

  return (
    <p
      onClick={handleCopy}
      className="flex justify-center items-center gap-2 text-gray-700 w-fit mx-auto text-lg underline hover:no-underline cursor-pointer"
    >
      {SHARED_TEXTS.COPY.EMAIL}
    </p>
  );
}
