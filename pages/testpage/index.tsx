import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import browserClient from "../../utils/axios-client/browser-client";

const TestPage: NextPage = ({}) => {
  const client = browserClient();
  const router = useRouter();

  const [signedUrl, setSignedUrl] = useState<string>("");

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
  }, []);

  useEffect(() => {
    loadCookie();
  }, []);

  const showImage = () => {
    router.push("/testpage/image");
  };

  return (
    <main>
      <div>
        <h1>Testing image</h1>

        <button onClick={showImage}>Show Images</button>
      </div>
    </main>
  );
};

export default TestPage;
