"use client";
import React, { useEffect, useState } from "react";
import { useQueueStore } from "@/app/store/auth/queue/queueStore";
import { useAuthStore } from "@/app/store/auth/authStore";
import styles from "./QueueDashboard.module.scss";
import {
  FaEnvelope,
  FaFile,
  FaPlay,
  FaPause,
  FaSync,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaSpinner,
} from "react-icons/fa";

export default function QueueDashboard() {
  const { user } = useAuthStore();
  const {
    stats,
    isLoading,
    lastUpdated,
    isAutoRefreshActive,
    fetchStats,
    startAutoRefresh,
    stopAutoRefresh,
    checkEmailStatus,
    sendTestEmail,
    emailStatuses,
  } = useQueueStore();

  const [userEmailStatus, setUserEmailStatus] = useState<any>(null);
  const [testEmailLoading, setTestEmailLoading] = useState(false);

  // Component mount'ta stats'ı fetch et
  useEffect(() => {
    fetchStats();

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, [fetchStats, stopAutoRefresh]);

  // User email status'ı kontrol et
  useEffect(() => {
    if (user?.id) {
      const checkStatus = async () => {
        const status = await checkEmailStatus(user.id);
        setUserEmailStatus(status);
      };
      checkStatus();
    }
  }, [user?.id, checkEmailStatus]);

  // Test email gönder
  const handleSendTestEmail = async () => {
    if (!user?.id || !user?.email || !user?.username) {
      alert("User information not available");
      return;
    }

    setTestEmailLoading(true);
    const success = await sendTestEmail(user.id, user.email, user.username);

    if (success) {
      // 3 saniye sonra email status'ı tekrar kontrol et
      setTimeout(async () => {
        const status = await checkEmailStatus(user.id);
        setUserEmailStatus(status);
      }, 3000);
    }

    setTestEmailLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Queue Monitoring Dashboard</h1>
        <div className={styles.controls}>
          <button
            onClick={isAutoRefreshActive ? stopAutoRefresh : startAutoRefresh}
            className={`${styles.controlButton} ${
              isAutoRefreshActive ? styles.active : ""
            }`}
          >
            {isAutoRefreshActive ? <FaPause /> : <FaPlay />}
            {isAutoRefreshActive ? "Stop Auto Refresh" : "Start Auto Refresh"}
          </button>

          <button
            onClick={fetchStats}
            disabled={isLoading}
            className={styles.controlButton}
          >
            <FaSync className={isLoading ? styles.spinning : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className={styles.statsGrid}>
          {/* Email Queue Card */}
          <div className={styles.queueCard}>
            <div className={styles.cardHeader}>
              <FaEnvelope className={styles.cardIcon} />
              <h3>Email Queue</h3>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <FaClock className={styles.metricIcon} />
                <span className={styles.metricLabel}>Waiting</span>
                <span className={styles.metricValue}>
                  {stats.email.waiting}
                </span>
              </div>

              <div className={styles.metric}>
                <FaSpinner className={styles.metricIcon} />
                <span className={styles.metricLabel}>Active</span>
                <span className={styles.metricValue}>{stats.email.active}</span>
              </div>

              <div className={styles.metric}>
                <FaCheckCircle className={styles.metricIcon} />
                <span className={styles.metricLabel}>Completed</span>
                <span className={styles.metricValue}>
                  {stats.email.completed}
                </span>
              </div>

              <div className={styles.metric}>
                <FaExclamationTriangle className={styles.metricIcon} />
                <span className={styles.metricLabel}>Failed</span>
                <span
                  className={`${styles.metricValue} ${
                    stats.email.failed > 0 ? styles.error : ""
                  }`}
                >
                  {stats.email.failed}
                </span>
              </div>
            </div>
          </div>

          {/* File Queue Card */}
          <div className={styles.queueCard}>
            <div className={styles.cardHeader}>
              <FaFile className={styles.cardIcon} />
              <h3>File Queue</h3>
            </div>

            <div className={styles.metrics}>
              <div className={styles.metric}>
                <FaClock className={styles.metricIcon} />
                <span className={styles.metricLabel}>Waiting</span>
                <span className={styles.metricValue}>
                  {stats.files.waiting}
                </span>
              </div>

              <div className={styles.metric}>
                <FaSpinner className={styles.metricIcon} />
                <span className={styles.metricLabel}>Active</span>
                <span className={styles.metricValue}>{stats.files.active}</span>
              </div>

              <div className={styles.metric}>
                <FaCheckCircle className={styles.metricIcon} />
                <span className={styles.metricLabel}>Completed</span>
                <span className={styles.metricValue}>
                  {stats.files.completed}
                </span>
              </div>

              <div className={styles.metric}>
                <FaExclamationTriangle className={styles.metricIcon} />
                <span className={styles.metricLabel}>Failed</span>
                <span
                  className={`${styles.metricValue} ${
                    stats.files.failed > 0 ? styles.error : ""
                  }`}
                >
                  {stats.files.failed}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Email Status */}
      {user && (
        <div className={styles.userSection}>
          <h3>Your Email Status</h3>
          <div className={styles.userCard}>
            <div className={styles.userInfo}>
              <p>
                <strong>User:</strong> {user.username} ({user.email})
              </p>
              {userEmailStatus && (
                <div className={styles.emailStatus}>
                  <p>
                    <strong>Welcome Email:</strong>
                    <span
                      className={
                        userEmailStatus.emailSent
                          ? styles.success
                          : styles.pending
                      }
                    >
                      {userEmailStatus.emailSent ? " ✅ Sent" : " ⏳ Pending"}
                    </span>
                  </p>
                  {userEmailStatus.emailSentAt && (
                    <p>
                      <strong>Sent At:</strong>{" "}
                      {formatDate(userEmailStatus.emailSentAt)}
                    </p>
                  )}
                  {userEmailStatus.jobId && (
                    <p>
                      <strong>Job ID:</strong> {userEmailStatus.jobId}
                    </p>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={handleSendTestEmail}
              disabled={testEmailLoading}
              className={styles.testButton}
            >
              {testEmailLoading ? "Sending..." : "Send Test Email"}
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className={styles.footer}>
        {lastUpdated && <p>Last updated: {formatDate(lastUpdated)}</p>}
        {isAutoRefreshActive && (
          <p className={styles.autoRefreshIndicator}>
            🔄 Auto refreshing every 5 seconds
          </p>
        )}
      </div>

      {/* Loading Overlay */}
      {isLoading && !stats && (
        <div className={styles.loading}>
          <FaSpinner className={styles.spinner} />
          <p>Loading queue statistics...</p>
        </div>
      )}
    </div>
  );
}
