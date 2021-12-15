import { ChangeEvent, Dispatch, SetStateAction, memo } from "react";

import { inputNames } from "../../../utils/enums-types/input-names";
import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";

// UI //
import {
  TextField,
  FormHelperText,
  FormControl,
  OutlinedInput,
  InputLabel,
} from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
  setFormHasError: Dispatch<SetStateAction<boolean>>;
}

function AddDescription(props: Props): JSX.Element {
  const {
    productInfo,
    dispatchAddInfo,
    propError,
    setErrors,
    setFormHasError,
  } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setFormHasError(false);
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  const error = !(
    propError[inputNames.desc] === undefined ||
    propError[inputNames.desc] === ""
  );

  return (
    <FormControl error={error} className={styles.desc_box}>
      <InputLabel htmlFor="outlined-price">Description</InputLabel>
      <OutlinedInput
        label="Description"
        multiline
        rows={7}
        name={inputNames.desc}
        value={productInfo.description}
        onChange={onChangeHandler}
        error={error}
        className={styles.input_box_shadow}
      />
      <FormHelperText className={styles.input_error}>
        {propError[inputNames.desc]}
      </FormHelperText>
    </FormControl>
  );
}

export default memo(AddDescription);
