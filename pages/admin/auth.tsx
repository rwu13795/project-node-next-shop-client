import { NextPage } from "next";
import { useRouter } from "next/dist/client/router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

import AuthForm from "../../components/auth/auth-form";
import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";
import { selectAdminUser } from "../../utils/redux-store/adminSlice";

const signIn_inputFieldsArray = [inputNames.admin_id, inputNames.password];
const register_inputFieldsArray = [
  inputNames.admin_id,
  inputNames.password,
  inputNames.confirm_password,
];

const AdminAuthPage: NextPage = () => {
  const router = useRouter();
  const adminUser = useSelector(selectAdminUser);

  useEffect(() => {
    if (adminUser.loggedInAsAdmin) {
      router.push("/admin");
    }
  });

  return (
    <main>
      <div>Sign In</div>
      <AuthForm
        inputFieldsArray={signIn_inputFieldsArray}
        inputType={inputTypes.adminSignIn}
      />
      <hr />
      <div>Register</div>
      <AuthForm
        inputFieldsArray={register_inputFieldsArray}
        inputType={inputTypes.adminRegister}
      />
    </main>
  );
};

export default AdminAuthPage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
