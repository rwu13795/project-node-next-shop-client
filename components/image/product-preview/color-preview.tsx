import React, { useState, memo, useEffect } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { PageColorProps } from "../../../utils/react-hooks/get-more-products";
import { setPreviewColorIndex } from "../../../utils/redux-store/shopSlice";

// UI //
import styles from "./__preview.module.css";
import { setPageLoading } from "../../../utils/redux-store/layoutSlice";

interface Props {
  colorProps: PageColorProps;
  colorIndex: number;
  productLink: string;
  activeColor: boolean[];
  productId: string;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
  page?: string;
}

function PreviewColor({
  colorProps,
  colorIndex,
  productLink,
  activeColor,
  productId,
  setActiveIndex,
  setPreviewImage,
  page,
}: Props): JSX.Element {
  const _ring = styles.color_ball_outer_ring;
  const _ring_active = styles.color_ball_outer_ring_active;
  const _ball = styles.color_ball;
  const _ball_container = styles.color_ball_container;

  const dispatch = useDispatch();
  const router = useRouter();
  const { imageFiles, colorCode } = colorProps;

  const [_style, set_style] = useState<string>("");

  useEffect(() => {
    set_style(activeColor[colorIndex] ? _ring_active : _ring);
  }, [activeColor, colorIndex, _ring_active, _ring]);

  const onMouseEnterHandler = () => {
    setActiveIndex(colorIndex);
    setPreviewImage(imageFiles[0]);
    dispatch(setPreviewColorIndex(colorIndex));
  };
  const onClickHandler = () => {
    dispatch(setPageLoading(true));
    dispatch(setPreviewColorIndex(colorIndex));
    if (page === "admin") {
      router.push(`/admin/add-product?productId=${productId}`);
    } else {
      router.push(productLink);
    }
  };

  return (
    <div className={_ball_container}>
      <div
        className={_style}
        onClick={onClickHandler}
        onMouseEnter={onMouseEnterHandler}
      >
        <div
          className={_ball}
          style={{
            backgroundColor: `${colorCode.toLowerCase()}`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default memo(PreviewColor);
