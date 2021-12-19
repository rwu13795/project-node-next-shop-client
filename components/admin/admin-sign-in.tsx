import {
  Dispatch,
  SetStateAction,
  useEffect,
  FormEvent,
  MouseEvent,
  memo,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import {
  Errors,
  finalCheck,
  InputValues,
  Touched,
} from "../../utils/helper-functions/input-error-check";
import {
  AdminErrors,
  adminSignIn,
  selectAdminErrors,
  selectLoadingStatus_admin,
} from "../../utils/redux-store/adminSlice";
import { inputNames } from "../../utils/enums-types/input-names";
import { AuthErrors } from "../../utils/redux-store/userSlice";
import { setPageLoading } from "../../utils/redux-store/layoutSlice";

// UI //
import { LoadingButton } from "@mui/lab";
import { sxMUI } from "./__admin-sign-in-up-MUI";

interface Props {
  inputFieldsArray: string[];
  inputValues: InputValues;
  setInputErrors: Dispatch<SetStateAction<Errors>>;
  inputFields: (
    fields: string[],
    inputValues: InputValues,
    requestError: AuthErrors | AdminErrors,
    page?: string
  ) => JSX.Element[];
  touched: Touched;
  page?: string;
}

function AdminSignIn({
  inputFieldsArray,
  inputValues,
  setInputErrors,
  inputFields,
  touched,
  page,
}: Props): JSX.Element {
  const dispatch = useDispatch();
  const router = useRouter();

  const adminErrors = useSelector(selectAdminErrors);
  const loadingStatus_admin = useSelector(selectLoadingStatus_admin);

  useEffect(() => {
    if (loadingStatus_admin === "loading") {
      dispatch(setPageLoading(true));
    } else {
      dispatch(setPageLoading(false));
    }
  }, [loadingStatus_admin, dispatch]);

  const adminSignInHandler = (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();

    let errorInput = finalCheck(inputValues, touched, setInputErrors);
    if (errorInput !== "") {
      let elem = document.getElementById(errorInput);
      if (elem) elem.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }

    dispatch(
      adminSignIn({
        admin_username: inputValues[inputNames.admin_username],
        password: inputValues[inputNames.password],
      })
    );
    router.push(`/admin/products-list`);
  };

  return (
    <form onSubmit={adminSignInHandler}>
      {inputFields(inputFieldsArray, inputValues, adminErrors, page)}

      <LoadingButton
        type="submit"
        variant="contained"
        onClick={adminSignInHandler}
        disabled={loadingStatus_admin === "loading"}
        loading={loadingStatus_admin === "loading"}
        sx={sxMUI.button}
      >
        Sign In
      </LoadingButton>
    </form>
  );
}

export default memo(AdminSignIn);
