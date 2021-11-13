import {
  useState,
  Fragment,
  SetStateAction,
  Dispatch,
  FocusEvent,
  ChangeEvent,
  MouseEvent,
  memo,
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
  openModal: boolean;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
}

const inputFieldsArray = ["title", "review", "nickname", "email", "size"];

const ratingKeys = ["one", "two", "three", "four", "five"];

export default function AddReviewModal({
  productId,
  openModal,
  setOpenModal,
}: Props): JSX.Element {
  const router = useRouter();
  const dispatch = useDispatch();

  const [inputValues, setInputValue] = useState<InputValues>(() => {
    return initializeValues(inputFieldsArray);
  });
  const [inputErrors, setInputErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [rating, setRating] = useState<string>("");

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

  const closeModal = () => setOpenModal(false);

  const reviewSubmitHandler = () => {
    let hasError = false;
    hasError = onSubmitErrorCheck(inputValues, inputErrors, setInputErrors);
    if (hasError) return;
    console.log("POST REVIEW", inputValues);
    console.log("RATING", rating);
    // dispatch(setPageLoading(true));
    // timer to close -- closeModal();
  };

  /* * * * * * * * * */
  // stars selecting //
  //
  /* * * * * * * * * */
  const initialColor = [
    styles.stars,
    styles.stars,
    styles.stars,
    styles.stars,
    styles.stars,
  ];
  const [starsColor, setStarsColor] = useState(initialColor);
  const [selectedStars, setSelectedStars] = useState(starsColor);
  const [isRated, setIsRated] = useState(false);
  const onClickHandler = (rating: number, ratingKey: string) => {
    setIsRated(true);
    setRating(ratingKey);
    setStarsColor(() => {
      let newColor = initialColor;
      for (let i = 0; i < rating; i++) {
        newColor[i] = styles.stars_active;
      }
      setSelectedStars(newColor);
      return newColor;
    });
  };

  const onMouseEnterHandler = (rating: number) => {
    setStarsColor(() => {
      let newColor = initialColor;
      for (let i = 0; i < rating; i++) {
        newColor[i] = styles.stars_active;
      }
      console.log(newColor);
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
  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

  return (
    <Fragment>
      <Modal
        disableScrollLock={true}
        open={openModal}
        onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box className={styles.main_container}>
            {ratingKeys.map((key, index) => {
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
            })}

            {inputFields(inputFieldsArray, inputValues)}
            <button onClick={reviewSubmitHandler}>POST REVIEW</button>
            <button onClick={closeModal}>CANCEL</button>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}

/* * * * * * * * * * * * */
// SelectStarsComponent //
/* * * * * * * * * * * * */
interface SubProps {
  ratingKey: string;
  index: number;
  starsColor: string[];
  selectedStars: string[];
  setStarsColor: Dispatch<SetStateAction<string[]>>;
  setSelectedStars: Dispatch<SetStateAction<string[]>>;
  setRating: Dispatch<SetStateAction<string>>;
}

// function SelectStarsComponent({
//   ratingKey,
//   index,
//   starsColor,
//   selectedStars,
//   setStarsColor,
//   setSelectedStars,
//   setRating,
// }: SubProps): JSX.Element {

//     const [isRated, setIsRated] = useState(false);
//   const onClickHandler = (rating: number, ratingKey: string) => {
//     setIsRated(true);
//     setRating(ratingKey);
//     setStarsColor(() => {
//       let newColor = initialColor;
//       for (let i = 0; i < rating; i++) {
//         newColor[i] = styles.stars_active;
//       }
//       setSelectedStars(newColor);
//       return newColor;
//     });
//   };

//   const onMouseEnterHandler = (rating: number) => {
//     setStarsColor(() => {
//       let newColor = initialColor;
//       for (let i = 0; i < rating; i++) {
//         newColor[i] = styles.stars_active;
//       }
//       console.log(newColor);
//       return newColor;
//     });
//   };

//   const onMouseOutHandler = (rating: number) => {
//     if (!isRated) {
//       setStarsColor(initialColor);
//     } else {
//       setStarsColor(selectedStars);
//     }
//   };

//   return (

//   );
// }

// const SelectStars = memo(SelectStarsComponent);
