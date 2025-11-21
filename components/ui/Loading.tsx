"use client";

import { Loader2 } from "lucide-react";

export default function Loading({ message = "Loading..." }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
      <Loader2 className="w-10 h-10 animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
