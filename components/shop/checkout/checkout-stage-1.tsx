import React, {
  useState,
  ChangeEvent,
  FocusEvent,
  SetStateAction,
  Dispatch,
  memo,
  FormEvent,
  MouseEvent,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  finalCheck,
  InputValues,
  onBlurErrorCheck,
  onChangeErrorCheck,
  onFocusErrorCheck,
  onFormEnterSubmitCheck,
  onSubmitErrorCheck,
} from "../../../utils/helper-functions/input-error-check";
import { inputNames } from "../../../utils/enums-types/input-names";
import {
  Touched,
  Errors,
} from "../../../utils/helper-functions/input-error-check";
import {
  selectShippingAddress,
  selectContactInfo,
  addressFields,
  contactFields,
  setShippingAddress,
  setContactInfo,
} from "../../../utils/redux-store/shopSlice";
import CartDetail from "../cart/cart-detail";
import renderInputFields from "../../../utils/helper-functions/render-input-fields";
import { AllowedStages } from "../../../pages/shop/checkout";
import {
  removeFromCartSession,
  selectCart,
} from "../../../utils/redux-store/userSlice";

// UI //
import { Button, SelectChangeEvent } from "@mui/material";
import styles from "./__stage.module.css";

interface Props {
  setStage: Dispatch<SetStateAction<string>>;
  setAllowedStages: Dispatch<SetStateAction<AllowedStages>>;
}

function CheckoutStage_1({ setStage, setAllowedStages }: Props): JSX.Element {
  const dispatch = useDispatch();
  const shippingAddress = useSelector(selectShippingAddress);
  const contactInfo = useSelector(selectContactInfo);
  const cart = useSelector(selectCart);

  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});

  const onFocusHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget;
    onFocusErrorCheck(name, setTouched);
  };

  const onBlurHandler = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onBlurErrorCheck(name, value, touched, setInputErrors);
  };

  const onChangeHandler = (
    e: ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (name === inputNames.email || name === inputNames.phone) {
      dispatch(setContactInfo({ name, value }));
    } else {
      dispatch(setShippingAddress({ name, value }));
    }
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const stageChangeHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(shippingAddress, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }
    errorInput = finalCheck(contactInfo, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center" });
      return;
    }

    for (let i = 0; i < cart.length; i++) {
      if (cart[i].quantity === 0) {
        dispatch(removeFromCartSession(i));
      }
    }
    setStage("2");
    window.scrollTo({ top: 0 });
    setAllowedStages({ two: true, three: false });
  };

  const inputFields = (fields: string[], inputValues: InputValues) => {
    return renderInputFields(
      fields,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors,
      undefined,
      undefined,
      "checkout"
    );
  };

  return (
    <main className={styles.main_container}>
      <div className={styles.left_grid}>
        <form onSubmit={stageChangeHandler}>
          <div>
            <div className={styles.sub_title}>SHIPPING ADDRESS</div>
            {inputFields(addressFields, shippingAddress)}
            <div className={styles.sub_title}>CONTACT INFO</div>
            {inputFields(contactFields, contactInfo)}
          </div>
          <div className={styles.button_box}>
            <Button
              type="submit"
              variant="contained"
              onClick={stageChangeHandler}
              className={styles.button}
            >
              CONTINUE
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.right_grid}>
        <div className={styles.summary_grid}>
          <CartDetail cart={cart} summaryMode={true} />
        </div>
      </div>

      <div className={styles.button_box_sticky}>
        <Button
          variant="contained"
          onClick={stageChangeHandler}
          className={styles.button_sticky}
        >
          CONTINUE
        </Button>
      </div>
    </main>
  );
}

export default memo(CheckoutStage_1);

/*
scroll to the specific element on button click

<input type="button" onClick="document.getElementById('middle').scrollIntoView();" />

*/
