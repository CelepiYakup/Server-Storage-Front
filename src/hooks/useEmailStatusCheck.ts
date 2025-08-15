"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth/authStore";
import { useQueueStore } from "@/app/store/auth/queue/queueStore";
import { useToast } from "@/app/context/ToastContext";

export function useEmailStatusCheck() {
  const { user, isAuthenticated } = useAuthStore();
  const { checkEmailStatus } = useQueueStore();
  const { showSuccess, showInfo } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const checkUserEmailStatus = async () => {
      try {
        console.log(`🔍 Checking email status for user: ${user.id}`);

        const emailStatus = await checkEmailStatus(user.id);

        if (emailStatus) {
          if (emailStatus.emailSent) {
            showSuccess(
              `Welcome email was sent on ${new Date(
                emailStatus.emailSentAt!
              ).toLocaleDateString()}`
            );
          } else {
            showInfo("Welcome email is being processed...");
          }
        }
      } catch (error) {
        console.error("Email status check failed:", error);
      }
    };

    const timeoutId = setTimeout(checkUserEmailStatus, 3000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isAuthenticated, user?.id, checkEmailStatus, showSuccess, showInfo]);
}

export function EmailStatusChecker() {
  useEmailStatusCheck();
  return null;
}
