import { NextPage } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import browserClient from "../../utils/axios-client/browser-client";

const TestPage: NextPage = ({}) => {
  const client = browserClient();
  const router = useRouter();

  const loadCookie = useCallback(async () => {
    try {
      await client.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/testing-cloud-front`
      );
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    loadCookie();
  }, []);

  // need to set the cookies before mapping the Urls
  // otherwise, the access will be denied, and users have to refresh the page to
  // see the images
  const showImage = () => {
    router.push("/testpage/image");
  };

  return (
    <main>
      <div>
        <h1>Testing CloudFront Signed Cookies</h1>
        <button onClick={showImage}>Show Images</button>
      </div>
    </main>
  );
};

export default TestPage;
