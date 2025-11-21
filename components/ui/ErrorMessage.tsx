"use client";

import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ title = "Something went wrong", message = "Please try again later." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-red-500">
      <AlertTriangle className="w-12 h-12 mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm">{message}</p>
    </div>
  );
}
