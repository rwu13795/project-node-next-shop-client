import { useState, useEffect } from "react";
import Router from "next/router";

import { useDispatch } from "react-redux";

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

  if (timeOut) {
    content = <h2>Session time out, you need to make a request again!</h2>;
  } else if (resetSuccess) {
    content = <h2>Your passwords has been reset successfully!</h2>;
  } else {
    content = <h2>You need to sign in to access this page!</h2>;
  }

  return (
    <div>
      {content}
      <h4>
        You will be redirected to the sign in page ... in {countDown} seconds
      </h4>
    </div>
  );
}
