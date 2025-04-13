"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function EventsPage() {
  const router = useNavigate();

  useEffect(() => {
    router.push("/events");
  }, [router]);

  return null;
}
