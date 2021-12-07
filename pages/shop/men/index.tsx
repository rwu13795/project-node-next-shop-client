import type { NextPage } from "next";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";

const Men: NextPage = ({}) => {
  useEffect(() => {
    return instantlyToTop();
  });

  return (
    <main>
      Men{" "}
      <div>
        <Link href="/shop/men/t-shirts">
          <a>T-Shirts</a>
        </Link>
      </div>
    </main>
  );
};

export default Men;

export function getStaticProps() {
  return { props: { page_cat: "men" } };
}
