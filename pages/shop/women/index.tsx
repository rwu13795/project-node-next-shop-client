import { useDispatch } from "react-redux";
import { useEffect } from "react";

import { instantlyToTop } from "../../../utils/helper-functions/scrollToTopInstantly";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

export default function Women({}) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageLoading(false));
  });
  useEffect(() => {
    return instantlyToTop;
  }, []);

  return <main>Women Home Page</main>;
}
