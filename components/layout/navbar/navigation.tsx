import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/dist/client/router";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  CSSProperties,
  useCallback,
} from "react";
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

import UserNavbar from "./user-navbar";
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

  const [classname, setClassname] = useState(styles.main_2);
  const [adminModal, setAdminModal] = useState<boolean>(false);

  /////////////////////////////////////////////////////////
  const changeNavbarClassname = useCallback(() => {
    console.log("checking window Y");
    if (window.scrollY < 100) {
      setClassname(styles.main_2);
    } else {
      setClassname(styles.main_1);
    }
  }, []);

  const scrollStopListener = useCallback(function scrollStop(
    callback,
    refresh = 500
  ) {
    // Make sure a valid callback was provided
    if (!callback || typeof callback !== "function") return;
    // Setup scrolling variable
    let isScrolling: any;
    // Listen for scroll events
    window.addEventListener(
      "scroll",
      (event) => {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        console.log("setting to transparent");
        setClassname(styles.main_2);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(callback, refresh);
      },
      false
    );
  },
  []);

  useEffect(() => {
    scrollStopListener(changeNavbarClassname);
  }, [scrollStopListener, changeNavbarClassname]);
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
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "70px" }}
      >
        <Grid item md={3} sm={5} xs={5} sx={{ height: "70px" }}>
          <Tooltip title="Home page">
            <Grid
              container
              justifyContent="flex-start"
              style={{
                paddingLeft: "5px",
                height: "70px",
              }}
              onClick={onLogoClickHandler}
            >
              <Image
                src="/Nextjs-logo-1.svg"
                alt="NextJS Logo"
                width={165}
                height={75}
              />
            </Grid>
          </Tooltip>
        </Grid>
        <Grid
          item
          md={9}
          sm={7}
          xs={7}
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ height: "70px" }}
        >
          {content}
        </Grid>
      </Grid>
      <Box sx={{ width: "100%" }}>{pageLoading && <LinearProgress />}</Box>
    </main>
  );
}
