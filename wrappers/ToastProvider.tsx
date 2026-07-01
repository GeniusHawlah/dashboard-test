"use client";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/ReactToastify.css";

export default function ToastProvider() {
  return (
    <ToastContainer
      transition={Zoom}
      position="top-center"
      autoClose={10000}
      hideProgressBar={false}
      closeOnClick={true}
      pauseOnHover={true}
      pauseOnFocusLoss={false}
      draggable={true}
      theme="light"
      className={" mx-4 font-light!"}
      toastClassName={
        " !max-w-[70%] 400:!max-w-[80%]  !font-light !text-sm sm:!text-base  sm:!max-w-full"
      }
    />
  );
}
