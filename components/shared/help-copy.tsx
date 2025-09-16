"use client";

import toast from "react-hot-toast";

export function HelpCopy() {
  const email = "viktoriosecret@gmail.com";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Скопійовано!");
    } catch (err) {
      toast.error("Не вдалося скопіювати пошту. Спробуйте вручну.");
      console.error("Failed to copy email to clipboard: ", err);
    }
  };

  return (
    <p
      onClick={handleCopy}
      className="flex justify-center items-center gap-2 text-gray-700 w-fit mx-auto text-lg underline hover:no-underline cursor-pointer"
    >
      {email}
    </p>
  );
}
