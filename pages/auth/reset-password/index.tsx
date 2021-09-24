import { useState } from "react";

import classes from "../../../styles/auth.module.css";
import useRequest from "../../../helpers/react-hooks/use-request";

export default function ResetRequestPage({}) {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState(false);

  const { makeRequest, errors } = useRequest({
    url: "http://localhost:8080/auth/reset-request",
    method: "post",
    body: {
      email: email,
    },
    onSuccess: () => setResponse(true),
  });

  async function resetPW(event) {
    event.preventDefault();
    console.log("Resetting password ...");
    await makeRequest();
  }

  return (
    <main>
      <form className={classes.login_form} onSubmit={resetPW}>
        <div>
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            name="email"
            required
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <button>Reset Password</button>
      </form>
      {errors}
      {response && (
        <h3>A link for resetting your password was sent to your email</h3>
      )}
    </main>
  );
}
