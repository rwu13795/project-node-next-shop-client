import {
  useState,
  Fragment,
  SetStateAction,
  Dispatch,
  FocusEvent,
  ChangeEvent,
  memo,
  useEffect,
} from "react";

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
import { Modal, Box, Backdrop, Fade, Button } from "@mui/material";
import { SelectChangeEvent } from "@mui/material";
import styles from "./__add-review.module.css";
import browserClient from "../../../../../utils/axios-client/browser-client";

interface Props {
  productId: string;
  openAddReivewModal: boolean;
  setReviewFilter: Dispatch<React.SetStateAction<string>>;
  setPageNum: Dispatch<React.SetStateAction<number>>;
  setOpenAddReivewModal?: Dispatch<React.SetStateAction<boolean>>;
  refreshReviewsUser?: (pageNum: number, reviewFilter: string) => Promise<void>;
}

const inputFieldsArray = ["title", "review", "nickname", "email", "size"];

function AddReviewModal({
  productId,
  openAddReivewModal,
  setOpenAddReivewModal,
  refreshReviewsUser,
  setReviewFilter,
  setPageNum,
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
      inputErrors,
      undefined,
      undefined,
      "add-review-modal"
    );
  };

  const closeModal = () => {
    setRating("");
    setInputValue(() => {
      return initializeValues(inputFieldsArray);
    });
    if (setOpenAddReivewModal) setOpenAddReivewModal(false);
  };

  const reviewSubmitHandler = async () => {
    let errorInputfield = "";
    errorInputfield = onSubmitErrorCheck(inputValues, setInputErrors);
    if (rating === "") {
      setRatingError("Rating required");
      errorInputfield = "error";
    }
    if (errorInputfield !== "") return;

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

    if (refreshReviewsUser) {
      await refreshReviewsUser(1, "");
      setReviewFilter("");
      setPageNum(1);
    }

    let elem = document.getElementById("review_submitted");
    if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
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
          <Box className={styles.modal_container}>
            <div className={styles.modal_grid}>
              <div className={styles.stars_container}>
                <div className={styles.rating_text}>OVERALL RATING</div>
                <div className={styles.stars_box}>
                  {SelectStars(setRating, setRatingError, openAddReivewModal)}
                </div>
                <div className={styles.rating_error}>{ratingError}</div>
              </div>
              <div className={styles.input_container}>
                {inputFields(inputFieldsArray, inputValues)}
              </div>
              <div className={styles.button_container}>
                <Button
                  variant="outlined"
                  onClick={reviewSubmitHandler}
                  disabled={submited}
                  className={styles.button}
                >
                  POST REVIEW
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  onClick={closeModal}
                  className={styles.button}
                >
                  CLOSE
                </Button>
              </div>
              {submited && (
                <div id="review_submitted" className={styles.submitted_text}>
                  Thank you for submitting your feedback!
                </div>
              )}
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
