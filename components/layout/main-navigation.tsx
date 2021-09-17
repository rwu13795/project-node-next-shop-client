import Link from "next/link";
import Head from "next/head";
import { Fragment } from "react";

import styles from "./main-navigation.module.css";

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  return (
    <Fragment>
      <main className={styles.main}>
        <section>
          <div>
            <Link href="/">
              <a>logo</a>
            </Link>
          </div>
          {page !== "a" && (
            <Fragment>
              <div>
                <Link href="/women">
                  <a>WOMEN</a>
                </Link>
              </div>
              <div>
                <Link href="/men">
                  <a>MEN</a>
                </Link>
              </div>
              <div>
                <Link href="/kids">
                  <a>KIDS</a>
                </Link>
              </div>
              <div>
                <Link href="/baby">
                  <a>BABY</a>
                </Link>
              </div>
            </Fragment>
          )}

          <div style={{ textAlign: "right" }}>
            <Link href="/baby">
              <a>BABY</a>
            </Link>
          </div>
        </section>
      </main>
    </Fragment>
  );
}
