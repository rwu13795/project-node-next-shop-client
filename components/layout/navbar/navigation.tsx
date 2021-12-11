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
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  getUserStatus,
  selectCurrentUser,
  selectIsLoggedIn,
  selectPageLoading_user,
  signOut,
} from "../../../utils/redux-store/userSlice";
import {
  adminSignOut,
  selectLoggedInAsAdmin,
} from "../../../utils/redux-store/adminSlice";
import {
  selectPageLoading,
  setPageLoading,
} from "../../../utils/redux-store/layoutSlice";
import UserNavbar from "./user-navbar";
import AdminSignOutModal from "./../../admin/admin-sign-out-modal";
import FilterViewIcon from "../navbar-items/filter-view-icon";

// UI //
import { Divider, Grid, TextField, Box, Tooltip, Button } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import styles from "./__navigation.module.css";

interface Props {
  page?: string;
  page_cat?: string;
  filter_view?: boolean;
}

export default function MainNavigation({ page, page_cat, filter_view }: Props) {
  const dispatch = useDispatch();
  const router = useRouter();
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);
  const pageLoading = useSelector(selectPageLoading);
  const pageLoading_user = useSelector(selectPageLoading_user);

  const [mainNavContainer, setMainNavContainer] = useState<string>(
    styles.main_1
  );
  const [filterContainer, setFilterContainer] = useState<string>(
    styles.filter_container_1
  );
  const [adminModal, setAdminModal] = useState<boolean>(false);

  /*******  Scroll Stop Listener for changing the color of the navbar  ********/
  const changeNavbarClassname = useCallback(() => {
    // console.log("checking window Y");
    // if (sub_cat) {
    //   setClassname(styles.main_3);
    // } else {
    setMainNavContainer(styles.main_1);
    setFilterContainer(styles.filter_container_1);
    // }
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

        // console.log("setting to transparent");
        setMainNavContainer(styles.main_2);
        setFilterContainer(styles.filter_container_2);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(callback, refresh);
      },
      false
    );
  },
  []);

  useEffect(() => {
    scrollStopListener(changeNavbarClassname);
    return () => {
      console.log("unmounting the scrollStopListener");
      window.addEventListener(
        "scroll",
        (event) => {
          event.stopImmediatePropagation();
        },
        true
      );
      window.removeEventListener("scroll", (event) => {
        event.stopImmediatePropagation();
      });
    };
  }, [scrollStopListener, changeNavbarClassname]);
  /******************************************************************************/

  const adminSignOutHandler = () => {
    dispatch(adminSignOut());
    setTimeout(() => {
      dispatch(getUserStatus());
    }, 2000);
    dispatch(setPageLoading(true));
    router.push("/admin");
  };

  const onLogoClickHandler = () => {
    if (loggedInAsAdmin) {
      setAdminModal(true);
    } else {
      if (page !== "home") dispatch(setPageLoading(true));
      router.push("/");
    }
  };

  let content;
  if (page === "admin") {
    content = (
      <div className={styles.admin_right_nav}>
        <AdminSignOutModal
          adminModal={adminModal}
          setAdminModal={setAdminModal}
        />
        <div>ADMINISTRATION</div>
        {loggedInAsAdmin && (
          <Button
            variant="outlined"
            color="warning"
            onClick={adminSignOutHandler}
            className={styles.sign_out_button}
          >
            Sign Out
          </Button>
        )}
      </div>
    );
  } else {
    content = <UserNavbar page={page} page_cat={page_cat} />;
  }

  return (
    <main className={mainNavContainer}>
      <Grid
        container
        justifyContent="space-between"
        alignItems="center"
        sx={{ height: "73px" }}
      >
        <Grid item md={3} sm={5} xs={5}>
          <Grid container justifyContent="flex-start">
            <Tooltip title="Home page">
              <Box onClick={onLogoClickHandler} className={styles.nav_logo}>
                <Image
                  src="/Nextjs-logo-1.svg"
                  alt="NextJS Logo"
                  width={165}
                  height={75}
                />
              </Box>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid
          item
          md={9}
          sm={7}
          xs={7}
          container
          justifyContent={page === "admin" ? "flex-end" : "space-between"}
          alignItems="center"
        >
          {content}
        </Grid>
      </Grid>

      {filter_view && (
        <Grid item container className={filterContainer}>
          <FilterViewIcon page={page} />
        </Grid>
      )}
      <Box sx={{ width: "100%" }}>
        {(pageLoading || pageLoading_user) && <LinearProgress />}
      </Box>
    </main>
  );
}
