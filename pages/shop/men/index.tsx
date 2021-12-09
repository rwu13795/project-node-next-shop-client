import type { NextPage } from "next";
import Link from "next/link";
import { useState, ChangeEvent, useEffect } from "react";
import { useDispatch } from "react-redux";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

const Men: NextPage = ({}) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

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
