import {
  useState,
  Fragment,
  SetStateAction,
  Dispatch,
  FocusEvent,
  ChangeEvent,
  MouseEvent,
  useMemo,
  memo,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";

import { initializeValues } from "../../../../../utils/helper-functions/initialize-values";
import renderInputFields from "../../../../../utils/helper-functions/render-input-fields";
import {
  Errors,
  InputValues,
  onChangeErrorCheck,
  Touched,
  onBlurErrorCheck,
  onFocusErrorCheck,
  onSubmitErrorCheck,
} from "../../../../../utils/helper-functions/input-error-check";

// UI //
import { Menu, Modal, Box, Backdrop, Fade } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import styles from "./__add-review.module.css";
import browserClient from "../../../../../utils/axios-client/browser-client";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outerHeight: 800,
  width: "100vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 0,
};

interface Props {
  productId: string;
  setOpenAddReivewModal: Dispatch<React.SetStateAction<boolean>>;
  openAddReivewModal: boolean;
  refreshReviews?: () => Promise<void>;
}

const inputFieldsArray = ["title", "review", "nickname", "email", "size"];

function AddReviewModal({
  productId,
  openAddReivewModal,
  setOpenAddReivewModal,
  refreshReviews,
}: Props): JSX.Element {
  const client = browserClient();

  const [inputValues, setInputValue] = useState<InputValues>(() => {
    return initializeValues(inputFieldsArray);
  });
  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [rating, setRating] = useState<string>("");
  const [ratingError, setRatingError] = useState<string>("");
  const [submited, setSubmited] = useState<boolean>(false);

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
    setInputValue((prev) => {
      return { ...prev, [name]: value };
    });
    onChangeErrorCheck(name, value, setInputErrors);
  };

  const inputFields = (fields: string[], inputValues: InputValues) => {
    return renderInputFields(
      fields,
      inputValues,
      onFocusHandler,
      onBlurHandler,
      onChangeHandler,
      inputErrors
    );
  };

  const closeModal = () => {
    setRating("");
    setOpenAddReivewModal(false);
  };

  const reviewSubmitHandler = async () => {
    let hasError = false;
    hasError = onSubmitErrorCheck(inputValues, inputErrors, setInputErrors);
    if (rating === "") {
      setRatingError("Rating required");
      hasError = true;
    }
    if (hasError) return;

    await client.post("http://localhost:5000/api/products/add-review", {
      productId,
      reviewProps: {
        title: inputValues.title,
        review: inputValues.review,
        rating,
        user_name: inputValues.nickname,
        user_email: inputValues.email,
        size: inputValues.size,
      },
    });

    setSubmited(true);
    if (refreshReviews) {
      await refreshReviews();
    }
  };

  return (
    <Fragment>
      <Modal
        disableScrollLock={true}
        open={openAddReivewModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openAddReivewModal}>
          <Box className={styles.modal_box}>
            <div className={styles.main_grid}>
              <div className={styles.stars_container}>
                {SelectStars(setRating, setRatingError, openAddReivewModal)}
                {ratingError}
              </div>
              {inputFields(inputFieldsArray, inputValues)}
              <button onClick={reviewSubmitHandler} disabled={submited}>
                POST REVIEW
              </button>
              <button onClick={closeModal}>CANCEL</button>
              {submited && <div>Thank you for submitting your feedback!</div>}
            </div>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}

export default memo(AddReviewModal);

/* * * * * * * * * */
// stars selecting //
/* * * * * * * * * */
const SelectStars = (
  setRating: Dispatch<SetStateAction<string>>,
  setRatingError: Dispatch<SetStateAction<string>>,
  openAddReivewModal: boolean
) => {
  const initialColor = [
    styles.stars,
    styles.stars,
    styles.stars,
    styles.stars,
    styles.stars,
  ];
  const ratingKeys = ["one", "two", "three", "four", "five"];
  const [starsColor, setStarsColor] = useState(initialColor);
  const [selectedStars, setSelectedStars] = useState(starsColor);
  const [isRated, setIsRated] = useState(false);
  const onClickHandler = (rating: number, ratingKey: string) => {
    setIsRated(true);
    setRating(ratingKey);
    setRatingError("");
    setStarsColor(() => {
      let newColor = initialColor;
      for (let i = 0; i < rating; i++) {
        newColor[i] = styles.stars_active;
      }
      setSelectedStars(newColor);
      return newColor;
    });
  };

  useEffect(() => {
    if (!openAddReivewModal) {
      setStarsColor(initialColor);
      setSelectedStars(initialColor);
    }
  }, [openAddReivewModal]);

  const onMouseEnterHandler = (rating: number) => {
    setStarsColor(() => {
      let newColor = initialColor;
      for (let i = 0; i < rating; i++) {
        newColor[i] = styles.stars_active;
      }
      return newColor;
    });
  };

  const onMouseOutHandler = (rating: number) => {
    if (!isRated) {
      setStarsColor(initialColor);
    } else {
      setStarsColor(selectedStars);
    }
  };

  return ratingKeys.map((key, index) => {
    return (
      <div
        key={key}
        className={starsColor[index]}
        onClick={() => {
          onClickHandler(index + 1, key);
        }}
        onMouseEnter={() => {
          onMouseEnterHandler(index + 1);
        }}
        onMouseOut={() => {
          onMouseOutHandler(index + 1);
        }}
      >
        ★
      </div>
    );
  });
};
