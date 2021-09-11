import { ChangeEvent, useState } from "react";

import { ProductCategory } from "../../pages/admin/add-product";

interface Props {
  catChangeHandler: (e: ChangeEvent<{ name?: string; value: unknown }>) => void;
  productCategory: ProductCategory;
}

const AddTitle = (props: Props): JSX.Element => {
  const { productCategory, catChangeHandler } = props;

  const [styles, setStyles] = useState({});
  const [wasTouched, setWasTouched] = useState(false);
  const [hasError, setHasError] = useState(false);

  const onFocusHandler = () => {
    setWasTouched(true);
  };

  const onBlurHandler = () => {
    console.log(wasTouched);
    if (wasTouched && productCategory.title === "") {
      // was touched before and no value, show error msg
      setStyles({ color: "red", border: "red solid 3px" });
      setHasError(true);
    } else {
      setStyles({});
    }
  };

  return (
    <div>
      <label>Title</label>
      <input
        name="title"
        type="text"
        value={productCategory.title}
        onChange={catChangeHandler}
        onBlur={onBlurHandler}
        onFocus={onFocusHandler}
        style={styles}
      ></input>
      {hasError && <span style={styles}>Title cannot be empty!</span>}
    </div>
  );
};

export default AddTitle;
