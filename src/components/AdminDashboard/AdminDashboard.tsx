"use client";
import React, { useEffect, useState } from "react";
import styles from "./AdminDashboard.module.scss";
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
  FaChartBar,
  FaServer,
} from "react-icons/fa";

interface QueueStats {
  email: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  files: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(
    null
  );

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/queue/stats`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
      setLastUpdated(new Date().toISOString());
      console.log(" Admin Dashboard - Stats updated:", data);
    } catch (error) {
      console.error("❌ Failed to fetch queue stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAutoRefresh = () => {
    if (autoRefresh) {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
      setAutoRefresh(false);
      console.log("⏸️ Auto refresh stopped");
    } else {
      const interval = setInterval(fetchStats, 5000);
      setRefreshInterval(interval);
      setAutoRefresh(true);
      console.log("▶️ Auto refresh started (5s)");
    }
  };

  useEffect(() => {
    fetchStats();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, []);

  const getTotalJobs = (queueStats: any) => {
    return (
      queueStats.waiting +
      queueStats.active +
      queueStats.completed +
      queueStats.failed
    );
  };

  const getSuccessRate = (queueStats: any) => {
    const total = getTotalJobs(queueStats);
    if (total === 0) return 100;
    return Math.round((queueStats.completed / total) * 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <FaServer className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Admin Queue Monitor</h1>
            <p className={styles.subtitle}>Real-time queue system monitoring</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button
            onClick={toggleAutoRefresh}
            className={`${styles.controlBtn} ${
              autoRefresh ? styles.active : ""
            }`}
          >
            {autoRefresh ? <FaPause /> : <FaPlay />}
            {autoRefresh ? "Stop Auto" : "Auto Refresh"}
          </button>

          <button
            onClick={fetchStats}
            disabled={isLoading}
            className={styles.controlBtn}
          >
            <FaSync className={isLoading ? styles.spinning : ""} />
            Refresh
          </button>
        </div>
      </div>

      {stats && (
        <div className={styles.overview}>
          <div className={styles.overviewCard}>
            <FaChartBar className={styles.overviewIcon} />
            <div className={styles.overviewContent}>
              <h3>Total Jobs Processed</h3>
              <div className={styles.overviewNumber}>
                {getTotalJobs(stats.email) + getTotalJobs(stats.files)}
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <FaCheckCircle className={styles.overviewIcon} />
            <div className={styles.overviewContent}>
              <h3>Success Rate</h3>
              <div className={styles.overviewNumber}>
                {Math.round(
                  ((stats.email.completed + stats.files.completed) /
                    (getTotalJobs(stats.email) + getTotalJobs(stats.files)) ||
                    1) * 100
                )}
                %
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <FaSpinner className={styles.overviewIcon} />
            <div className={styles.overviewContent}>
              <h3>Active Jobs</h3>
              <div className={styles.overviewNumber}>
                {stats.email.active + stats.files.active}
              </div>
            </div>
          </div>

          <div className={styles.overviewCard}>
            <FaExclamationTriangle className={styles.overviewIcon} />
            <div className={styles.overviewContent}>
              <h3>Failed Jobs</h3>
              <div className={styles.overviewNumber}>
                {stats.email.failed + stats.files.failed}
              </div>
            </div>
          </div>
        </div>
      )}

      {stats && (
        <div className={styles.queueGrid}>
          <div className={styles.queueCard}>
            <div className={styles.cardHeader}>
              <FaEnvelope className={styles.cardIcon} />
              <div className={styles.cardTitle}>
                <h3>Email Queue</h3>
                <span className={styles.successRate}>
                  {getSuccessRate(stats.email)}% success rate
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <FaClock className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Waiting</span>
                    <span className={styles.statValue}>
                      {stats.email.waiting}
                    </span>
                  </div>
                </div>

                <div className={styles.stat}>
                  <FaSpinner className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Active</span>
                    <span className={styles.statValue}>
                      {stats.email.active}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <FaCheckCircle className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Completed</span>
                    <span className={styles.statValue}>
                      {stats.email.completed}
                    </span>
                  </div>
                </div>

                <div className={styles.stat}>
                  <FaExclamationTriangle className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Failed</span>
                    <span
                      className={`${styles.statValue} ${
                        stats.email.failed > 0 ? styles.error : ""
                      }`}
                    >
                      {stats.email.failed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.queueCard}>
            <div className={styles.cardHeader}>
              <FaFile className={styles.cardIcon} />
              <div className={styles.cardTitle}>
                <h3>File Processing Queue</h3>
                <span className={styles.successRate}>
                  {getSuccessRate(stats.files)}% success rate
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <FaClock className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Waiting</span>
                    <span className={styles.statValue}>
                      {stats.files.waiting}
                    </span>
                  </div>
                </div>

                <div className={styles.stat}>
                  <FaSpinner className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Active</span>
                    <span className={styles.statValue}>
                      {stats.files.active}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.statRow}>
                <div className={styles.stat}>
                  <FaCheckCircle className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Completed</span>
                    <span className={styles.statValue}>
                      {stats.files.completed}
                    </span>
                  </div>
                </div>

                <div className={styles.stat}>
                  <FaExclamationTriangle className={styles.statIcon} />
                  <div className={styles.statInfo}>
                    <span className={styles.statLabel}>Failed</span>
                    <span
                      className={`${styles.statValue} ${
                        stats.files.failed > 0 ? styles.error : ""
                      }`}
                    >
                      {stats.files.failed}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          {lastUpdated && (
            <span className={styles.timestamp}>
              Last updated: {formatDate(lastUpdated)}
            </span>
          )}
        </div>

        <div className={styles.footerRight}>
          {autoRefresh && (
            <span className={styles.autoRefreshIndicator}>
              Auto refreshing every 5 seconds
            </span>
          )}

          <span className={styles.systemStatus}>
            System Status: <strong className={styles.online}>Online</strong>
          </span>
        </div>
      </div>

      {isLoading && !stats && (
        <div className={styles.loadingOverlay}>
          <FaSpinner className={styles.loadingSpinner} />
          <p>Loading admin dashboard...</p>
        </div>
      )}
    </div>
  );
}
