import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import AuthForm from "../../components/forms/auth-form";
import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  clearAdminErrors,
  // getAdminStatus,
  selectAdminUser,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

// UI //
import { CircularProgress, Grid } from "@mui/material";
import styles from "./__index.module.css";

const signIn_inputFieldsArray = [
  inputNames.admin_username,
  inputNames.password,
];
const register_inputFieldsArray = [
  inputNames.admin_username,
  inputNames.password,
  inputNames.confirm_password,
];

const AdminPage: NextPage = () => {
  const dispatch = useDispatch();

  const router = useRouter();
  const adminUser = useSelector(selectAdminUser);
  const loggedInAsAdmin = useSelector(selectLoggedInAsAdmin);

  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(loggedInAsAdmin && true)

  // console.log("adminUser in index-------------->", loggedInAsAdmin);

  useEffect(() => {
    if (loggedInAsAdmin) {
      router.push(`/admin/products-list`);
    }
  }, [loggedInAsAdmin, adminUser.admin_username, router]);

  // `/admin/products-list?admin_username=${adminUser.admin_username}&page=1`

  const switchHandler = () => {
    dispatch(clearAdminErrors("all"));
    setIsRegistering((prev) => !prev);
  };

  return (
    <main className={styles.main}>
      <Grid container className={styles.main_grid}>
        {loggedInAsAdmin === true ? (
          <div>
            <CircularProgress />
          </div>
        ) : isRegistering ? (
          <Grid>
            <button onClick={switchHandler}>Sign In</button>
            <div>Or</div>
            <hr />
            <div>Register</div>
            <AuthForm
              inputFieldsArray={register_inputFieldsArray}
              inputType={inputTypes.adminRegister}
            />
          </Grid>
        ) : (
          <Grid>
            <div>Sign In</div>
            <AuthForm
              inputFieldsArray={signIn_inputFieldsArray}
              inputType={inputTypes.adminSignIn}
            />
            <hr />
            <div>Or</div>
            <button onClick={switchHandler}>Register</button>
          </Grid>
        )}
      </Grid>
    </main>
  );
};

export default AdminPage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
