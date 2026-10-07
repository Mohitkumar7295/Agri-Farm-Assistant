"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SupportRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/help");
  }, [router]);

  return null;
}
