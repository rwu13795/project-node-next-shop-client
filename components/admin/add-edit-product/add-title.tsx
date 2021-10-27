import { ReducerProductInfo } from "../../../utils/react-hooks/add-product-reducer";
import { inputNames } from "../../../utils/enums-types/input-names";
import { AddInfoEvents } from "../../../pages/admin/add-product";
import { Errors } from "../../../utils/helper-functions/input-error-check";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { onChangeErrorCheck } from "../../../utils/helper-functions/input-error-check";

// UI //
import { TextField } from "@mui/material";

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

  const error =
    propError[inputNames.title] === undefined ||
    propError[inputNames.title] === "";

  console.log("title", error);

  return (
    <TextField
      sx={{ minWidth: 220 }}
      name={inputNames.title}
      type="text"
      value={productInfo.title}
      onChange={onChangeHandler}
      label="Title"
      error={!error}
      helperText={propError[inputNames.title]}
    />
  );
}
