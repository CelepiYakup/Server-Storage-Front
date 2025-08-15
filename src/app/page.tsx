import styles from "./page.module.scss";
import { QueueStatus } from "@/components/QueueStatus/QueueStatus";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        {/* <h1 className={styles.title}>Storage Server</h1>
        <p className={styles.description}>
          Welcome to your secure file storage solution
        </p> */}
        <QueueStatus />
      </div>
    </main>
  );
}
