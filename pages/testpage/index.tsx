import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

import browserClient from "../../utils/axios-client/browser-client";

const TestPage: NextPage = ({}) => {
  const client = browserClient();

  const [signedUrl, setSignedUrl] = useState<string>("");

  const loadCookie = async () => {
    try {
      const { data } = await client.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/testing-cloud-front`
      );

      setSignedUrl(data);
      console.log("getting signedUrl", data);
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <main>
      <div>
        <h1>Testing image</h1>
        <img
          src={`https://cdn.node-next-shop-rw.store/testing/cat1.jpg`}
          alt="1"
        />
        <img
          src={`https://cdn.node-next-shop-rw.store/testing/cat2.jpg`}
          alt="1"
        />
        <img
          src={`https://cdn.node-next-shop-rw.store/testing/cat3.jpg`}
          alt="1"
        />
        <img src={`https://cdn.node-next-shop-rw.store/cat1.jpg`} alt="1" />
        <img src={signedUrl} alt="signedUrl" />
        <button onClick={loadCookie}>load cookie</button>
      </div>
    </main>
  );
};

export default TestPage;
