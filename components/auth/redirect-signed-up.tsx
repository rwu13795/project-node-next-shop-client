import { useState, useEffect } from "react";
import { Fragment } from "react";
import { useRouter } from "next/dist/client/router";
import { useDispatch } from "react-redux";

import { getUserStatus } from "../../utils/redux-store/userSlice";

export default function Redirect_signedUp_to_homePage(): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();
  const [countDown, SetCountDown] = useState<number>(6);

  useEffect(() => {
    dispatch(getUserStatus());

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
      router.push("/");
    }, 5000);
    return () => {
      clearInterval(timerId);
      clearTimeout(id);
    };
  }, [router, dispatch]);

  return (
    <Fragment>
      <h1>Thank you for joining us!</h1>
      <h4>
        You will be redirected to the home page ... in {countDown} seconds
      </h4>
    </Fragment>
  );
}
