import { ChangeEvent, useRef, useState } from "react";
import { SelectChangeEvent } from "@mui/material";

import { ProductInfo } from "../../util/react-hooks/add-product-reducer";
import { FieldNames } from "../../util/enums/input-field-names";
import { AddInfoEvents } from "../../pages/admin/add-product";

interface Props {
  dispatchAddInfo: (e: AddInfoEvents) => void;
  productInfo: ProductInfo;
}

export default function AddTitle(props: Props): JSX.Element {
  const { dispatchAddInfo, productInfo } = props;

  // const [styles, setStyles] = useState({});
  // const [wasTouched, setWasTouched] = useState(false);
  // const [hasError, setHasError] = useState(false);

  // const onFocusHandler = () => {
  //   setWasTouched(true);
  // };

  // const onBlurHandler = () => {
  //   console.log(wasTouched);
  //   if (wasTouched && productCategory.title === "") {
  //     // was touched before and no value, show error msg
  //     setStyles({ color: "red", border: "red solid 3px" });
  //     setHasError(true);
  //   } else {
  //     setStyles({});
  //     setHasError(false);
  //   }
  // };

  return (
    <div>
      <label>Title</label>
      <input
        name={FieldNames.title}
        type="text"
        value={productInfo.title}
        onChange={dispatchAddInfo}
        // onBlur={onBlurHandler}
        // onFocus={onFocusHandler}
        // style={styles}
      ></input>
      {/* {errors && errors[FieldNames.title] && (
          <div>{errors[FieldNames.title]}</div>
        )} */}
    </div>
  );
}
