import { NextPage } from "next";

import AuthForm from "../../components/auth/sign-in-up-form";
import { inputNames } from "../../utils/enums-types/input-names";
import { inputTypes } from "../../utils/enums-types/input-types";

const signIn_inputFieldsArray = [inputNames.admin_id, inputNames.password];
const register_inputFieldsArray = [
  inputNames.admin_id,
  inputNames.password,
  inputNames.confirm_password,
];

const AdminAuthPage: NextPage = () => {
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
