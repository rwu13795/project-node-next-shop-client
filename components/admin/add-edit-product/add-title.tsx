import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { inputNames } from "../../../utils/enums-types/input-names";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { onChangeErrorCheck } from "../../../utils/helper-functions/input-error-check";

// UI //
import { TextField, FormControl, FormHelperText, Grid } from "@mui/material";
import styles from "./__styles.module.css";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ReducerProductInfo;
  propError: Errors;
  setErrors: Dispatch<SetStateAction<Errors>>;
}

export default function AddTitle(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo, propError, setErrors } = props;

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    onChangeErrorCheck(name, value, setErrors);
    dispatchAddInfo(e);
  };

  const error = !(
    propError[inputNames.title] === undefined ||
    propError[inputNames.title] === ""
  );

  return (
    <Grid
      item
      container
      xs={12}
      sm={6}
      md={12}
      className={styles.form_grid_center}
    >
      <FormControl error={error} className={styles.form_control}>
        <TextField
          name={inputNames.title}
          type="text"
          value={productInfo.title}
          onChange={onChangeHandler}
          label="Title"
          error={error}
        />
        <FormHelperText className={styles.input_error}>
          {propError[inputNames.title]}
        </FormHelperText>
      </FormControl>
    </Grid>
  );
}
