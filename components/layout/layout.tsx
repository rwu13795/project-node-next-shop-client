import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import MainNavigation from "./navbar/navigation";
import { checkStock, getUserStatus } from "../../utils/redux-store/userSlice";
import Footer from "./footer";
import { selectLockScrollBar } from "../../utils/redux-store/layoutSlice";

import styles from "./__layout.module.css";

interface Prop {
  children: React.ReactNode;
  page?: string;
  page_cat?: string;
  filter_view?: boolean;
}

export default function Layout({
  children,
  page,
  page_cat,
  filter_view,
}: Prop): JSX.Element {
  // since the Layout component will be rendered on every page,
  // the user auth will be checked no matter which page is loaded up first
  const dispatch = useDispatch();

  const lockScrollBar = useSelector(selectLockScrollBar);

  const [scrollBarStyle, setScrollBarStyle] = useState({});

  useEffect(() => {
    if (lockScrollBar) {
      setScrollBarStyle({ maxHeight: "100vh", overflow: "hidden" });
    } else {
      // to hidden the weird x-scroll bar in Home page which appears after unlocking
      // since all the pages' width is under 100vw, so setting the overflowX: "hidden"
      // won't break anything in all the children pages
      setScrollBarStyle({});
    }
  }, [lockScrollBar]);

  useEffect(() => {
    dispatch(getUserStatus());
    // delay the checkstock for 2 seconds, so that the session can be created
    // and checkStock won't trigger a duplicated session in the shop route
    const timerId = setTimeout(() => {
      dispatch(checkStock());
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [dispatch]);

  return (
    <main className={styles.root_page_layout} style={scrollBarStyle}>
      <MainNavigation
        page={page}
        page_cat={page_cat}
        filter_view={filter_view}
      />

      <div className={styles.main_component}>
        <div className={styles.main_component_grid}>{children}</div>
      </div>

      {page !== "checkout" && <Footer page={page} />}
    </main>
  );
}
