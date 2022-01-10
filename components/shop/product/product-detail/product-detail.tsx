import React, { useState, useEffect, memo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  PageColorProps,
  PageProductProps,
} from "../../../../utils/react-hooks/get-more-products";
import ProductDetailImages from "./swiper-images/images";
import SelectSize from "./line-items/sizes";
import SelectQuantity from "./line-items/quantities";
import SelectColors from "./line-items/colors";
import ReviewsWrapper from "./reviews/reviews-wrapper";
import RatingSummary from "./reviews/rating-summary";
import ProductDescriptionWrapper from "./product-desc-wrapper";
import { inputNames } from "../../../../utils/enums-types/input-names";
import { Reviews } from "../../../../pages/shop/product-detail/[product_id]";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../../utils/helper-functions/input-error-check";
import {
  addToCartSession,
  selectEditItem,
} from "../../../../utils/redux-store/userSlice";
import {
  selectPreviewColorIndex,
  setPreviewColorIndex,
} from "../../../../utils/redux-store/shopSlice";

// UI //
import { Grid, Button, useMediaQuery } from "@mui/material";
import styles from "./__product-detail.module.css";

interface Props {
  product: PageProductProps;
  reviewDoc?: Reviews;
  editModeItem?: boolean;
  handleClose?: () => void; // the function to close the modal onClick "Update"
  refreshReviewsUser?: (pageNum: number, reviewFilter: string) => Promise<void>;
  resetReviewsUser?: () => void;
}

function ProductDetail({
  product,
  reviewDoc,
  editModeItem,
  handleClose,
  refreshReviewsUser,
  resetReviewsUser,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();
  // get the editItem info from the Cart-detail-page
  const editItem = useSelector(selectEditItem);
  const colorIndex = useSelector(selectPreviewColorIndex);
  const isSmall = useMediaQuery("(max-width: 765px)");

  const { productInfo, colorPropsList, _id } = product;

  const [currentColor, setCurrentColor] = useState<PageColorProps>(() => {
    if (editModeItem && editItem) {
      for (let colorProps of colorPropsList) {
        if (colorProps.colorName === editItem.item.colorName) {
          return colorProps;
        }
      }
      return colorPropsList[0];
    } else {
      return colorPropsList[0];
    }
  });

  useEffect(() => {
    if (colorIndex !== -1) {
      setCurrentColor(colorPropsList[colorIndex]);
      dispatch(setPreviewColorIndex(-1));
    }
  }, [colorIndex, colorPropsList, dispatch]);

  // if in editMode, initailize the props with the editItem in the redux-store
  const [selectedSize, setSelectedSize] = useState<string>(() => {
    if (editModeItem && editItem) return editItem.item.size;
    else return "";
  });
  const [quantity, setQuantity] = useState<number>(() => {
    if (editModeItem && editItem) return editItem.item.quantity;
    else return 0;
  });
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [openAddReivewModal, setOpenAddReivewModal] = useState<boolean>(false);

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
      sub_cat: productInfo.sub_cat,
      productId: _id,
      price: productInfo.price,
      quantity: quantity,
      size: selectedSize,
      colorName: currentColor.colorName,
      colorCode: currentColor.colorCode,
      availableQty: currentColor.sizes[selectedSize],
      stockError: "",
    };
    if (editModeItem && handleClose) {
      handleClose();
    }
    // update the cart, adding new item or editing item both can use the same reducer
    dispatch(
      addToCartSession({ item, editMode: editModeItem, index: editItem?.index })
    );
    if (editModeItem && isSmall) {
      router.push("/shop/cart");
    }
  };

  return (
    <main className={styles.main_container}>
      <Grid container className={styles.main_grid}>
        <Grid container className={styles.upper_grid}>
          <Grid sx={{ display: { xs: "flex", md: "none" } }}>
            <div className={_title}>{productInfo.title.toUpperCase()}</div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} className={_images_container}>
            <ProductDetailImages
              currentColor={currentColor}
              previewImage={previewImage}
            />
          </Grid>

          <Grid
            item
            container
            xs={12}
            sm={12}
            md={4}
            className={_desc_container}
          >
            <Grid
              sx={{ display: { xs: "none", md: "flex" } }}
              className={_line_item}
            >
              <div className={_title}>{productInfo.title.toUpperCase()}</div>
            </Grid>

            {!editModeItem && reviewDoc && (
              <div className={_line_item}>
                <RatingSummary
                  averageRating={reviewDoc.averageRating}
                  total={reviewDoc.total}
                  setOpenAddReivewModal={setOpenAddReivewModal}
                />
              </div>
            )}

            <div className={_line_item}>
              <div className={_line_item_grid}>
                <div style={{ fontSize: "18px" }}>Price: </div>
                <div className={_price}>$ {productInfo.price}</div>
              </div>
            </div>

            <div className={_divider}></div>

            <div className={_line_item}>
              <SelectColors
                colorPropsList={colorPropsList}
                currentColorCode={currentColor.colorCode}
                changeColorHandler={changeColorHandler}
                setPreviewImage={setPreviewImage}
              />
            </div>

            <div className={_line_item}>
              <div className={_line_item_grid}>
                <div style={{ fontSize: "18px" }}>Sizes: </div>
                <SelectSize
                  selectedSize={selectedSize}
                  sizeHandler={sizeHandler}
                  currentColor={currentColor}
                />
              </div>
            </div>
            <div className={_error}>{errors[inputNames.size]}</div>

            <div className={_divider}></div>

            <div className={_line_item}>
              <div className={_line_item_grid}>
                <SelectQuantity
                  quantity={quantity}
                  disabled={selectedSize === ""}
                  availableQty={currentColor.sizes[selectedSize]}
                  setQuantity={setQuantity}
                  setErrors={setErrors}
                />
              </div>
            </div>
            <div className={_error}>{errors[inputNames.quantity]}</div>

            <div className={_line_item}>
              <Button
                variant="contained"
                onClick={addToCartHandler}
                className={styles.product_desc_cart}
              >
                {editModeItem ? "Update" : "Add to cart"}
              </Button>
            </div>

            <Grid
              sx={{
                display: {
                  xs: "none",
                  sm: "none",
                  md: "none",
                  lg: "none",
                  xl: "flex",
                },
              }}
            >
              <div className={_line_item}>
                <div style={{ fontSize: "18px" }}>Product Detail: </div>
                <div className={_detail}>{productInfo.description}</div>
              </div>
            </Grid>
          </Grid>
        </Grid>

        <Grid className={styles.lower_grid}>
          <ProductDescriptionWrapper description={productInfo.description} />
        </Grid>

        <Grid
          className={styles.lower_grid}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          {!editModeItem && reviewDoc && (
            <ReviewsWrapper
              reviewDoc={reviewDoc}
              setOpenAddReivewModal={setOpenAddReivewModal}
              openAddReivewModal={openAddReivewModal}
              refreshReviewsUser={refreshReviewsUser}
              resetReviewsUser={resetReviewsUser}
            />
          )}
        </Grid>
      </Grid>
    </main>
  );
}

export default memo(ProductDetail);

const _price = styles.product_desc_price;
const _title = styles.product_desc_title;
const _line_item = styles.product_desc_line_items;
const _line_item_grid = styles.product_desc_line_items_inner_grid;
const _images_container = styles.product_images_container;
const _desc_container = styles.product_desc_container;
const _divider = styles.product_desc_divider;
const _error = styles.product_desc_error;
const _detail = styles.product_desc_detail;
