import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import { Fragment, useEffect, useRef, useState, CSSProperties } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  signOut,
} from "../../../utils/redux-store/userSlice";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../../utils/redux-store/adminSlice";

import UserNavbar from "./user-narbar";
import AdminSignOutModal from "./../../admin/admin-sign-out-modal";

// UI //
import { Divider, Grid, TextField, Box, Tooltip } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./__navigation.module.css";
import { selectPageLoading } from "../../../utils/redux-store/layoutSlice";

interface Props {
  page?: string;
}

export default function MainNavigation({ page }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);
  const pageLoading = useSelector(selectPageLoading);

  const [classname, setClassname] = useState(styles.main_1);
  const [adminModal, setAdminModal] = useState<boolean>(false);

  /////////////////////////////////////////////////////////
  // when user is scrolling, turn the Navbar to transparent
  let handle: any = null;
  function createScrollStopListener(
    element: Window,
    callback: Function,
    timeout: number
  ) {
    let onScroll = function () {
      if (handle) {
        clearTimeout(handle);
        if (classname !== styles.main_2) {
          setClassname(styles.main_2);
        }
      }
      handle = setTimeout(callback, timeout || 200); // default 200 ms
    };
    element.addEventListener("scroll", onScroll);
    return function () {
      element.removeEventListener("scroll", onScroll);
    };
  }

  useEffect(() => {
    console.log("scroll detection in navbar", page);
    createScrollStopListener(
      window,
      function () {
        if (window.pageYOffset < 200) {
          setClassname(styles.main_2);
        } else {
          setClassname(styles.main_1);
        }
      },
      1500
    );
    // return () => {
    //   clearTimeout(handle);
    // };
  }, []);
  /////////////////////////////////////////////////////////

  const adminSignOutHandler = () => {
    dispatch(adminSignOut());
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    router.push("/admin");
  };

  const onLogoClickHandler = () => {
    if (loggedInAsAdmin) {
      setAdminModal(true);
    } else {
      router.push("/");
    }
  };

  let content;
  if (page !== "admin") {
    content = <UserNavbar page={page} />;
  } else {
    content = (
      <div>
        <AdminSignOutModal
          adminModal={adminModal}
          setAdminModal={setAdminModal}
        />
        {loggedInAsAdmin && (
          <button onClick={adminSignOutHandler}>Sign Out</button>
        )}
      </div>
    );
  }

  return (
    <main className={classname}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item md={2} sm={5} xs={5}>
          <Tooltip title="Home page">
            <div style={{ paddingLeft: "1.5vw" }} onClick={onLogoClickHandler}>
              <Image
                src="/Nextjs-logo-1.svg"
                alt="NextJS Logo"
                width={195}
                height={90}
              />
            </div>
          </Tooltip>
        </Grid>
        <Grid
          item
          md={10}
          sm={7}
          xs={7}
          container
          justifyContent="space-between"
          alignItems="center"
        >
          {content}
        </Grid>
      </Grid>
      <Box sx={{ width: "100%" }}>{pageLoading && <LinearProgress />}</Box>
    </main>
  );
}
