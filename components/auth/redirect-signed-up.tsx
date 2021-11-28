import { useState, useEffect } from "react";
import { Fragment } from "react";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";

import { getUserStatus } from "../../utils/redux-store/userSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

import styles from "./__redirect.module.css";

export default function Redirect_signedUp_to_homePage(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const [countDown, SetCountDown] = useState<number>(6);

  useEffect(() => {
    dispatch(getUserStatus());
    dispatch(setPageLoading(false));
    // count down
    const timer = () => {
      SetCountDown((prev) => {
        if (prev === 0) {
          return 0;
        }
        return prev - 1;
      });
    };
    timer();
    const timerId = setInterval(timer, 1000);

    // redirect time out
    const id = setTimeout(() => {
      router.push("/");
    }, 5000);
    return () => {
      clearInterval(timerId);
      clearTimeout(id);
    };
  }, [router, dispatch]);

  return (
    <Fragment>
      <div className={styles.main_title}>Thank you for joining us!</div>
      <div className={styles.sub_title}>
        You will be redirected to the home page ... in {countDown} seconds
      </div>
    </Fragment>
  );
}
