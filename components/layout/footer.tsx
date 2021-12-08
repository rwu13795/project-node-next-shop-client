import Image from "next/image";
import Link from "next/link";

import styles from "./__footer.module.css";

interface Props {
  page?: string;
}

export default function Footer({ page }: Props): JSX.Element {
  const footer = page === "home" ? styles.footer_home : styles.footer;

  return (
    <footer className={footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{" "}
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
      </a>
      <div style={{ paddingRight: "2vh" }}>
        <Link href="/admin">
          <a>Administration</a>
        </Link>
      </div>
      <div>foot testing block</div>
    </footer>
  );
}
