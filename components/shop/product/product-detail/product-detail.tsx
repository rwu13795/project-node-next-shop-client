import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  PageColorProps,
  PageProductProps,
} from "../../../../utils/react-hooks/get-more-products";
import ProductDetailImages from "./swiper-images/images";
import SelectSize from "./line-items/sizes";
import SelectQuantity from "./line-items/quantities";
import SelectColors from "./line-items/colors";
import { inputNames } from "../../../../utils/enums-types/input-names";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../../utils/helper-functions/input-error-check";
import {
  addToCartSession,
  CartItem,
} from "../../../../utils/redux-store/userSlice";

// UI //
import { Grid, Button, Box } from "@mui/material";
import styles from "./__product-detail.module.css";

interface Props {
  product: PageProductProps;
  editMode?: boolean;
  index?: number;
  editItem?: CartItem;
  handleClose?: () => void; // the function to close the modal onClick "Update"
}

export default function ProductDetail({
  product,
  editMode,
  index,
  editItem,
  handleClose,
}: Props): JSX.Element {
  const _price = styles.product_desc_price;
  const _size = styles.product_desc_line_items + " " + styles.product_desc_size;
  const _line_item = styles.product_desc_line_items;
  const _line_item_grid = styles.product_desc_line_items_inner_grid;
  const _images_container = styles.product_images_container;
  const _desc_container = styles.product_desc_container;
  /****************************************************************************/

  const { productInfo, colorPropsList, _id } = product;
  const dispatch = useDispatch();

  const [currentColor, setCurrentColor] = useState<PageColorProps>(() => {
    if (editMode && editItem) {
      for (let colorProps of colorPropsList) {
        if (colorProps.colorName === editItem.colorName) {
          return colorProps;
        }
      }
      return colorPropsList[0];
    } else {
      return colorPropsList[0];
    }
  });
  // if in editMode, initailize the props with the selected info in the current cart
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (editMode && editItem) return editItem.size;
    else return "";
  });
  const [quantity, setQuantity] = useState<number>(() => {
    if (editMode && editItem) return editItem.quantity;
    else return 0;
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});

  const sizeHandler = (e: React.MouseEvent<HTMLElement>, size: string) => {
    setSelectedSize(size);
    setQuantity(0);
    onChangeErrorCheck(inputNames.size, size, setErrors);
  };

  const changeColorHandler = (index: number) => {
    setCurrentColor(colorPropsList[index]);
    setSelectedSize("");
    setQuantity(0);
  };

  const addToCartHandler = () => {
    // console.log(selectedSize, quantity, currentColor.colorName);
    if (!selectedSize) {
      setErrors({ [inputNames.size]: "Please select a size" });
      return;
    }
    if (quantity === 0) {
      setErrors({ [inputNames.quantity]: "Please select a valid quantity" });
      return;
    }

    const item = {
      imageUrl: currentColor.imageFiles[0],
      title: productInfo.title,
      main_cat: productInfo.main_cat,
      productId: _id,
      price: productInfo.price,
      quantity: quantity,
      size: selectedSize,
      colorName: currentColor.colorName,
      colorCode: currentColor.colorCode,
      availableQty: currentColor.sizes[selectedSize],
      stockError: "",
    };
    if (editMode && handleClose) {
      handleClose();
    }
    dispatch(addToCartSession({ item, editMode, index }));
  };

  return (
    <main>
      <div>HOME/MEN/TOPS/CASUAL SHIRTS FLANNEL</div>

      <Grid container className={styles.upper_grid}>
        <Grid sx={{ display: { xs: "flex", md: "none" } }}>
          <h2>{productInfo.title.toUpperCase()}</h2>
        </Grid>
        <Grid item xs={12} sm={12} md={8} className={_images_container}>
          <ProductDetailImages
            currentColor={currentColor}
            previewImage={previewImage}
          />
        </Grid>

        <Grid item container xs={12} sm={12} md={4} className={_desc_container}>
          <Grid
            sx={{ display: { md: "flex", xs: "none" } }}
            className={_line_item}
          >
            <h2>{productInfo.title.toUpperCase()}</h2>
          </Grid>

          <div className={_line_item}>Review *****</div>

          <div className={_line_item}>
            <div className={_line_item_grid}>
              <div style={{ fontSize: "15px" }}>Price: </div>
              <div className={_price}>$ {productInfo.price}</div>
            </div>
          </div>

          <div className={_line_item}>
            <SelectColors
              colorPropsList={colorPropsList}
              currentColor={currentColor}
              changeColorHandler={changeColorHandler}
              setPreviewImage={setPreviewImage}
            />
          </div>

          <div className={_size}>
            <SelectSize
              selectedSize={selectedSize}
              sizeHandler={sizeHandler}
              currentColor={currentColor}
            />
            {errors[inputNames.size]}
          </div>

          <div className={_line_item}>
            <SelectQuantity
              quantity={quantity}
              disabled={selectedSize === ""}
              availableQty={currentColor.sizes[selectedSize]}
              setQuantity={setQuantity}
              setErrors={setErrors}
            />
            {errors[inputNames.quantity]}
          </div>

          <div className={_line_item}>
            <Button
              variant="contained"
              onClick={addToCartHandler}
              className={styles.product_desc_cart}
            >
              {editMode ? "Update" : "Add to cart"}
            </Button>
          </div>

          <div className={_line_item}>{productInfo.description}</div>
        </Grid>
      </Grid>
    </main>
  );
}
