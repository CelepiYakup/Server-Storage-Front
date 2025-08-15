"use client";

import React, { useState, useEffect, useRef } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import { useAuthStore } from "@/app/store/auth/authStore";
import { useRouter } from "next/navigation";
import { EmailStatusChecker } from "@/hooks/useEmailStatusCheck";

interface ClientLayoutProps {
  children: React.ReactNode;
}

function ClientLayout({ children }: ClientLayoutProps) {
  const [isSidebarOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const { isAuthenticated, logout, sessionExpiredLogout } = useAuthStore();
  const router = useRouter();
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    const resetTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        sessionExpiredLogout();
        router.push("/login");
      }, 59 * 1000);
    };

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
    ];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, logout, router, sessionExpiredLogout]);

  return (
    <>
      <Navbar />
      <Sidebar
        isOpen={isSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        onClose={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <main className="main-content">{children}</main>
      
      <EmailStatusChecker />
    </>
  );
}

export default ClientLayout;