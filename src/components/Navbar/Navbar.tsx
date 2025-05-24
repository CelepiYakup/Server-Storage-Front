"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaSignOutAlt } from "react-icons/fa";
import styles from "./Navbar.module.scss";
import { useAuthStore } from "@/app/store/auth/authStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    router.push("/login");
  };

  return (
    <header className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.navbarContainer}>
        <div className={styles.navbarLeft}>
          <Link href="/" className={styles.logo}>
            Server Storage
          </Link>
          <nav className={styles.navLinks}>
            <Link
              href="/"
              className={`${styles.navLink} ${
                pathname === "/" ? styles.active : ""
              }`}
            >
              Home
            </Link>
            <Link
              href="/files"
              className={`${styles.navLink} ${
                pathname.startsWith("/files") ? styles.active : ""
              }`}
            >
              Files
            </Link>
            <Link
              href="/upload"
              className={`${styles.navLink} ${
                pathname.startsWith("/upload") ? styles.active : ""
              }`}
            >
              Upload
            </Link>
          </nav>
        </div>

        <div className={styles.navbarRight}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button
                className={styles.userButton}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className={styles.userAvatar}>
                  {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                </div>
                <span className={styles.username}>{user?.username}</span>
              </button>

              {isDropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.userAvatarLarge}>
                      {user?.username?.charAt(0).toUpperCase() || <FaUser />}
                    </div>
                    <div>
                      <div className={styles.usernameLarge}>
                        {user?.username}
                      </div>
                      <div className={styles.userEmail}>{user?.email}</div>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />

                  <Link
                    href="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <FaUser className={styles.dropdownIcon} />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className={styles.dropdownItem}
                  >
                    <FaSignOutAlt className={styles.dropdownIcon} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link href="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link href="/register" className={styles.registerButton}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
