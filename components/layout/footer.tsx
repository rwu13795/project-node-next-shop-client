import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useState } from "react";

import styles from "./__footer.module.css";

interface Props {
  page?: string;
}

function Footer({ page }: Props): JSX.Element {
  const [footer, setFooter] = useState<string>(styles.footer_home);

  useEffect(() => {
    if (page === "home") {
      setFooter(styles.footer_home);
    } else {
      setFooter(styles.footer);
    }
  }, [page]);

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
          <a
            href="https://github.com/rwu13795?tab=repositories"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={styles.link}>&copy; 2022 By Ray Wu</div>
          </a>
          <a
            href="https://heroku.com"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className={styles.logo}>
              <div>Powered by </div>
              <Image
                src={page === "home" ? "/heroku.svg" : "/heroku-white.svg"}
                alt="Heroku Logo"
                width={76}
                height={20}
              />
            </div>
          </a>
        </div>
      </div>
    </footer>
  );
}

export default memo(Footer);
