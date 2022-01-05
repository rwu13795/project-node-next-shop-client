import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Head from "next/head";

import AuthForm from "../../components/forms/auth-form";
import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import {
  clearAdminErrors,
  getAdminStatus,
  selectAdminUser,
  selectLoggedInAsAdmin,
} from "../../utils/redux-store/adminSlice";
import { instantlyToTop } from "../../utils/helper-functions/scrollToTopInstantly";
import serverClient from "../../utils/axios-client/server-client";

// UI //
import { Button } from "@mui/material";
import styles from "./__admin_index.module.css";

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

  useEffect(() => {
    dispatch(getAdminStatus());
    return instantlyToTop;
  }, []);

  useEffect(() => {
    if (loggedInAsAdmin) {
      router.push(`/admin/products-list`);
    }
  }, [loggedInAsAdmin, router]);

  const switchHandler = () => {
    dispatch(clearAdminErrors("all"));
    setIsRegistering((prev) => !prev);
  };

  return (
    <main className={styles.main}>
      <Head>
        <title>Administration</title>
      </Head>

      <div className={styles.title}>ADMINISTRATION</div>
      {isRegistering ? (
        <div className={styles.main_grid}>
          <div className={styles.right_grid}>
            <div className={styles.text}>
              Have an existing Adminstrator account?
            </div>
            <Button variant="contained" onClick={switchHandler} sx={button}>
              Sign In
            </Button>
          </div>

          <div className={styles.mid_grid}>
            <div className={styles.mid_grid_line}></div>
            <div className={styles.text_2}>OR</div>
            <div className={styles.mid_grid_line}></div>
          </div>

          <div className={styles.left_grid}>
            <div className={styles.text}>Register</div>
            <AuthForm
              inputFieldsArray={register_inputFieldsArray}
              inputType={inputTypes.adminRegister}
              page="admin-auth"
            />
          </div>
        </div>
      ) : (
        <div className={styles.main_grid}>
          <div className={styles.left_grid}>
            <div className={styles.text}>Sign in as Administrator</div>
            <AuthForm
              inputFieldsArray={signIn_inputFieldsArray}
              inputType={inputTypes.adminSignIn}
              page="admin-auth"
            />
          </div>

          <div className={styles.mid_grid}>
            <div className={styles.mid_grid_line}></div>
            <div className={styles.text_2}>OR</div>
            <div className={styles.mid_grid_line}></div>
          </div>

          <div className={styles.right_grid}>
            <div className={styles.text}>
              Create a new Administrator account
            </div>
            <Button variant="contained" onClick={switchHandler} sx={button}>
              Register
            </Button>
          </div>
        </div>
      )}
    </main>
  );
};

export default AdminPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const client = serverClient(context);

  const { data } = await client.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/admin/admin-status`
  );

  if (data.adminUser.loggedInAsAdmin) {
    return {
      redirect: {
        destination: "/admin/products-list",
        permanent: false,
      },
    };
  }

  return { props: { page: "admin" } };
}

const button = {
  width: "80%",
  maxWidth: "400px",
  fontSize: "min(16px, 4vw)",
  mt: "10px",
};
