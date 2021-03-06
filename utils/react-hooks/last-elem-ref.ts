import { useCallback, MutableRefObject, Dispatch, SetStateAction } from "react";
import { RequestParams } from "../../components/shop/product/sub-cat-list";

export default function useLastElementRef(
  isLoading: boolean,
  observer: MutableRefObject<IntersectionObserver | undefined>,
  hasMore: boolean,
  setParams?: Dispatch<SetStateAction<RequestParams>>,
  setPageNum?: Dispatch<SetStateAction<number>>
) {
  return useCallback(
    // the node is the element that is being "ref" currently
    (node: HTMLDivElement) => {
      if (isLoading) return;
      if (observer.current) {
        // remove the old observer, and add the new observer to the newly fetched last element
        observer.current.disconnect();
      }
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          if (setParams) {
            setParams((prev) => {
              let pageNum = prev.pageNum + 1;
              return { ...prev, pageNum };
            });
          }
          if (setPageNum) {
            setPageNum((prev) => {
              return prev + 1;
            });
          }
        }
      });
      // observe the current element
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, observer, setParams, setPageNum]
  );
}
