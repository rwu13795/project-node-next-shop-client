import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { Button, CircularProgress, SelectChangeEvent } from "@mui/material";

import AuthForm from "../../components/auth/auth-form";
import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  getAdminStatus,
  selectAdminUser,
  selectLoadingStatus_admin,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";

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

  console.log("adminUser in index-------------->", loggedInAsAdmin);

  useEffect(() => {
    if (loggedInAsAdmin) {
      router.push(
        `/admin/products-list?admin_username=${adminUser.admin_username}&page=1`
      );
    }
  }, [loggedInAsAdmin, adminUser.admin_username, router]);

  const switchHandler = () => {
    setIsRegistering((prev) => !prev);
  };

  if (loggedInAsAdmin === undefined || loggedInAsAdmin === true) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  return isRegistering ? (
    <main>
      <button onClick={switchHandler}>Sign In</button>
      <div>Or</div>
      <hr />
      <div>Register</div>
      <AuthForm
        inputFieldsArray={register_inputFieldsArray}
        inputType={inputTypes.adminRegister}
      />
    </main>
  ) : (
    <main>
      <div>Sign In</div>
      <AuthForm
        inputFieldsArray={signIn_inputFieldsArray}
        inputType={inputTypes.adminSignIn}
      />
      <hr />
      <div>Or</div>
      <button onClick={switchHandler}>Register</button>
    </main>
  );
};

export default AdminPage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
