import React, { useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

import {
  PageColorProps,
  PageProductProps,
} from "../../utils/react-hooks/get-more-products";
import SelectSize from "./select-size";
import SelectQuantity from "./select-quantity";
import { inputNames } from "../../utils/enums-types/input-names";
import {
  Errors,
  onChangeErrorCheck,
} from "../../utils/react-hooks/input-error-check";
import {
  addToCartSession,
  CartItem,
  selectCart,
} from "../../utils/redux-store/userSlice";
import { Button } from "@mui/material";

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
  const { productInfo, colorPropsList } = product;
  const dispatch = useDispatch();
  // const cartState = useSelector(selectCart);

  // console.log(cartState);

  const [currentColor, setCurrentColor] = useState<PageColorProps>(
    colorPropsList[0]
  );
  // if in editMode, initailize the props with the selected info in the current cart
  const [selectedSize, setSelectedSize] = useState<string | undefined>(() => {
    if (editMode && editItem) return editItem.size;
  });
  const [quantity, setQuantity] = useState<string>(() => {
    if (editMode && editItem) {
      return editItem.quantity.toString();
    } else return "1";
  });
  const [errors, setErrors] = useState<Errors>({});

  const sizeHandler = (e: React.MouseEvent<HTMLElement>, size: string) => {
    setSelectedSize(size);
    onChangeErrorCheck(inputNames.size, size, setErrors);
  };

  const addToCartHandler = () => {
    // console.log(selectedSize, quantity, currentColor.colorName);
    if (!selectedSize) {
      setErrors({ [inputNames.size]: "please select a size" });
      return;
    }
    const item = {
      imageUrl: currentColor.imageFiles[0],
      title: productInfo.title,
      main_cat: productInfo.main_cat,
      productId: product._id,
      price: productInfo.price,
      quantity: parseInt(quantity),
      size: selectedSize,
      colorName: currentColor.colorName,
      totalQty: currentColor.sizes[selectedSize],
    };
    if (editMode && handleClose) {
      handleClose();
    }
    dispatch(addToCartSession({ item, editMode, index }));
  };

  return (
    <main>
      <div>product title : {productInfo.title}</div>

      {/* need images swiper */}
      <div>
        {currentColor.imageFiles.map((image, index) => {
          let width, height;
          if (index === 0) {
            width = 400;
            height = 400;
          } else {
            width = 200;
            height = 200;
          }
          return (
            <Image
              key={index}
              src={image}
              alt={productInfo.title}
              width={width}
              height={height}
            />
          );
        })}
      </div>

      <h3>{productInfo.price} USD</h3>
      <h3>{productInfo.description}</h3>

      <div>
        {colorPropsList.map((prop, index) => {
          return (
            <button
              onClick={() => {
                setCurrentColor(colorPropsList[index]);
              }}
              key={index}
            >
              {prop.colorName}
            </button>
          );
        })}
      </div>
      <SelectSize selectedSize={selectedSize} sizeHandler={sizeHandler} />
      {errors[inputNames.size]}
      <SelectQuantity
        quantity={quantity}
        totalQty={selectedSize ? currentColor.sizes![selectedSize] : 0}
        setQuantity={setQuantity}
      />
      <div>
        <Button variant="contained" onClick={addToCartHandler}>
          {editMode ? "Update" : "Add to cart"}
        </Button>
      </div>
    </main>
  );
}
