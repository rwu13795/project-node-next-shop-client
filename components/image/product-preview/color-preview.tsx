import React, {
  useState,
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
} from "react";
import { PageColorProps } from "../../../utils/react-hooks/get-more-products";

// UI //

import styles from "./__preview.module.css";
import { useRouter } from "next/router";

interface Props {
  colorProps: PageColorProps;
  colorIndex: number;
  productLink: string;
  activeColor: boolean[];
  initialActiveColor: boolean[];
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  setPreviewImage: React.Dispatch<React.SetStateAction<string>>;
}

function PreviewColor({
  colorProps,
  colorIndex,
  productLink,
  activeColor,
  initialActiveColor,
  setActiveIndex,
  setPreviewImage,
}: Props): JSX.Element {
  const _container = styles.color_container;
  const _ring = styles.color_ball_outer_ring;
  const _ring_active = styles.color_ball_outer_ring_active;
  const _ball = styles.color_ball;
  const _ball_container = styles.color_ball_container;

  const router = useRouter();
  const { imageFiles, colorCode } = colorProps;

  const [_style, set_style] = useState<string>("");

  useEffect(() => {
    set_style(activeColor[colorIndex] ? _ring_active : _ring);
  }, [activeColor, colorIndex, _ring_active, _ring]);

  const onMouseEnterHandler = () => {
    setActiveIndex(colorIndex);
    setPreviewImage(imageFiles[0]);
    
    // dispatch colorIndex here !!!!!!!!!!
  };
  const onClickHandler = () => {
    router.push(productLink);
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
            backgroundColor: `${colorCode.toUpperCase()}`,
          }}
        ></div>
      </div>
    </div>
  );
}

export default memo(PreviewColor);
