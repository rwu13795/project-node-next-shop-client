import { ChangeEvent, Dispatch, SetStateAction } from "react";

import { inputNames } from "../../../utils/enums-types/input-names";
import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import {
  Errors,
  onChangeErrorCheck,
} from "../../../utils/helper-functions/input-error-check";

// UI //
import { TextField, FormHelperText, FormControl } from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function AddDescription(props: Props): JSX.Element {
  const { productInfo, dispatchAddInfo, propError, setErrors } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  const error = !(
    propError[inputNames.desc] === undefined ||
    propError[inputNames.desc] === ""
  );

  return (
    <FormControl error={error} className={styles.desc_box}>
      <TextField
        id="standard-multiline-flexible"
        label="Description"
        multiline
        rows={6}
        name={inputNames.desc}
        value={productInfo.description}
        onChange={onChangeHandler}
        error={error}
        // helperText={propError[inputNames.desc]}
      />
      <FormHelperText className={styles.input_error}>
        {propError[inputNames.desc]}
      </FormHelperText>
    </FormControl>
  );
}

/*
        <div>
      <label>Description: </label>
      <textarea
        name={inputNames.desc}
        rows={6}
        value={productInfo.description}
        onChange={onChangeHandler}
      ></textarea>

      <span>{propError[inputNames.desc]}</span>
    </div> 
    */
