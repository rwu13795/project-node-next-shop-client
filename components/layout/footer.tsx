import Image from "next/image";
import Link from "next/link";
import { memo } from "react";

import styles from "./__footer.module.css";

interface Props {
  page?: string;
}

function Footer({ page }: Props): JSX.Element {
  const footer = page === "home" ? styles.footer_home : styles.footer;

  return (
    <footer className={footer}>
      <div className={styles.main_grid}>
        <div className={styles.left_grid}>
          <div>
            <div className={styles.link_text}>Contact</div>
            <div>rwu13795.work@gmail.com</div>
          </div>
        </div>

        {page !== "admin" && (
          <div className={styles.middle_grid}>
            <Link href="/shop/order-status">
              <a style={{ textDecoration: "none", color: "inherit" }}>
                <div className={styles.link_text + " " + styles.link}>
                  Order Status
                </div>
              </a>
            </Link>
            <Link href="/admin">
              <a style={{ textDecoration: "none", color: "inherit" }}>
                <div className={styles.link_text + " " + styles.link}>
                  Administration
                </div>
              </a>
            </Link>
          </div>
        )}

        <div className={styles.right_grid}>
          <div>&copy; 2022 By Ray Wu</div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div className={styles.logo}>
              <div>Powered by </div>
              <Image
                src={page === "home" ? "/vercel.svg" : "/vercel-white.svg"}
                alt="Vercel Logo"
                width={72}
                height={16}
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
