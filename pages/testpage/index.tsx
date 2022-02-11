import { NextPage } from "next";
import { useCallback, useEffect } from "react";

import browserClient from "../../utils/axios-client/browser-client";

const TestPage: NextPage = ({}) => {
  const client = browserClient();

  const loadCookie = async () => {
    try {
      await client.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/testing-cloud-front`
      );
      console.log("getting cookie");
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <main>
      <div>
        <h1>Testing image</h1>
        <img
          src={`https://d2a05ov3ia61kl.cloudfront.net/testing/cat1.jpg`}
          alt="1"
        />
        <img
          src={`https://d2a05ov3ia61kl.cloudfront.net/testing/cat2.jpg`}
          alt="1"
        />
        <img
          src={`https://d2a05ov3ia61kl.cloudfront.net/testing/cat3.jpg`}
          alt="1"
        />
        <img src={`https://d2a05ov3ia61kl.cloudfront.net/cat1.jpg`} alt="1" />
        <button onClick={loadCookie}>load cookie</button>
      </div>
    </main>
  );
};

export default TestPage;
