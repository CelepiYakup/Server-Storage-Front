import Link from "next/link";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            Storage Server
          </Link>

          <div className={styles.navLinks}>
            <Link href="/files">Files</Link>
            <Link href="/upload">Upload</Link>
            <Link href="/login">Login</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
