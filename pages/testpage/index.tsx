import { NextPage } from "next";
import { useCallback, useEffect, useState } from "react";

import browserClient from "../../utils/axios-client/browser-client";

const TestPage: NextPage = ({}) => {
  const client = browserClient();

  const [signedUrl, setSignedUrl] = useState<string>("");

  const [urls, setUrls] = useState({ a: "", b: "", c: "" });

  const loadCookie = useCallback(async () => {
    try {
      const { data } = await client.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/testing-cloud-front`
      );

      setSignedUrl(data);
      console.log("getting signedUrl", data);
    } catch (err: any) {
      console.log(err);
    }
  }, [client]);

  useEffect(() => {
    loadCookie();
    setTimeout(() => {
      console.log("showing images");
      setUrls({
        a: `https://cdn.node-next-shop-rw.store/testing/cat1.jpg`,
        b: `https://cdn.node-next-shop-rw.store/testing/cat2.jpg`,
        c: `https://cdn.node-next-shop-rw.store/testing/cat3.jpg`,
      });
    }, 3000);
  }, [loadCookie]);

  return (
    <main>
      <div>
        <h1>Testing image</h1>
        <img src={urls.a} alt="1" />
        <img src={urls.b} alt="1" />
        <img src={urls.c} alt="1" />
        <img src={`https://cdn.node-next-shop-rw.store/cat1.jpg`} alt="1" />
        <img src={signedUrl} alt="signedUrl" />
        {/* <button onClick={loadCookie}>load cookie</button> */}
      </div>
    </main>
  );
};

export default TestPage;
