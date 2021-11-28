import { useState, useEffect } from "react";
import Router from "next/router";
import { useDispatch } from "react-redux";

import styles from "./__redirect.module.css";

interface Props {
  resetSuccess?: boolean;
  timeOut?: boolean;
}

export default function Redirect_to_signIn({
  resetSuccess,
  timeOut,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const [countDown, SetCountDown] = useState<number>(6);

  useEffect(() => {
    // count down
    const timer = () => {
      SetCountDown((prev) => {
        if (prev === 0) return 0;
        return prev - 1;
      });
    };
    timer();
    const timerId = setInterval(timer, 1000);

    // redirect time out
    const id = setTimeout(() => {
      Router.push("/auth/sign-in");
    }, 5000);
    return () => {
      clearInterval(timerId);
      clearTimeout(id);
    };
  }, []);

  let content;
  let main = styles.main_title;

  if (timeOut) {
    content = (
      <div className={main}>
        Session time out, you need to make a request again!
      </div>
    );
  } else if (resetSuccess) {
    content = (
      <div className={main}>Your passwords has been reset successfully!</div>
    );
  } else {
    content = (
      <div className={main}>You need to sign in to access this page!</div>
    );
  }

  return (
    <div>
      {content}
      <div className={styles.sub_title}>
        You will be redirected to the sign in page ... in {countDown} seconds
      </div>
    </div>
  );
}
