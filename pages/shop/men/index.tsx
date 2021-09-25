import type { NextPage } from "next";
import Link from "next/link";
import { useState, ChangeEvent } from "react";

const Men: NextPage = ({}) => {
  const [email, setEmail] = useState("");

  const [styles, setStyles] = useState({ color: "green", border: "" });
  const [wasEmailTouched, setWasEmailTouched] = useState(false);

  // implementation for the label text transition and error message (like Zara login fields)
  const onFocusHandler = () => {
    setWasEmailTouched(true);
    setStyles({ color: "blue", border: "blue solid 2px" });
  };

  const onBlurHandler = () => {
    console.log(wasEmailTouched);
    if (wasEmailTouched && email === "") {
      // was touched before and no value, show error msg
      setStyles({ color: "red", border: "red solid 5px" });
    } else {
      setStyles({ color: "green", border: "" });
    }
  };

  const setEmailHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  return (
    <main>
      Men{" "}
      <div>
        <Link href="/shop/men/t-shirts">
          <a>T-Shirts</a>
        </Link>
      </div>
    </main>
  );
};

export default Men;
