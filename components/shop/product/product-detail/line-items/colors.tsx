import React, { useState, Dispatch, SetStateAction, memo } from "react";
import { PageColorProps } from "../../../../../utils/react-hooks/get-more-products";

// UI //
import { ToggleButtonStyled } from "../../../../../styles/mui-custom-components";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

import styles from "./__colors.module.css";

interface Props {
  colorPropsList: PageColorProps[];
  currentColor: PageColorProps;
  changeColorHandler: (index: number) => void;
  setPreviewImage: Dispatch<SetStateAction<string>>;
}

function SelectColors({
  colorPropsList,
  currentColor,
  changeColorHandler,
  setPreviewImage,
}: Props): JSX.Element {
  const _container = styles.color_container;
  const _ring = styles.color_ball_outer_ring;
  const _ring_active = styles.color_ball_outer_ring_active;
  const _ball = styles.color_ball;
  const _ball_container = styles.color_ball_container;

  return (
    <div className={_container}>
      <div style={{ marginRight: "14px" }}>Colors:</div>
      {colorPropsList.map((prop, index) => {
        let active: string = _ring;
        if (prop.colorName === currentColor.colorName) {
          active = _ring_active;
        }
        return (
          <div key={index} className={_ball_container}>
            <div className={active}>
              <div
                onClick={() => {
                  changeColorHandler(index);
                  setPreviewImage("");
                }}
                onMouseEnter={() => {
                  setPreviewImage(prop.imageFiles[0]);
                }}
                onMouseOut={() => {
                  setPreviewImage("");
                }}
                className={_ball}
                style={{
                  backgroundColor: `${prop.colorCode.toUpperCase()}`,
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default memo(SelectColors);
