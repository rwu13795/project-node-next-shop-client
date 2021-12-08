import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

export default function Kids({}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
    return instantlyToTop();
  });

  return <main>Kids Home Page</main>;
}
