import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";
import { SelectChangeEvent } from "@mui/material";

import { ProductInfo, InfoChangeHandler } from "../../pages/admin/add-product";
import { FieldNames } from "../../util/enums/input-field-names-enum";

interface Props {
  infoChangeHandler: InfoChangeHandler;
  productInfo: ProductInfo;
}

export default function AddTitle(props: Props): JSX.Element {
  const { productInfo, infoChangeHandler } = props;

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
        onChange={(e) => infoChangeHandler(e.target.value, e.target.name)}
        // onBlur={onBlurHandler}
        // onFocus={onFocusHandler}
        // style={styles}
      ></input>
      {/* {hasError && <span style={styles}>Title cannot be empty!</span>} */}
    </div>
  );
}
