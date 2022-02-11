import { NextPage } from "next";
import Image from "next/image";

const TestImage: NextPage = ({}) => {
  console.log(
    `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/2.jpg`
  );

  // cloudFront signed cookies are NOT working in Next/Image
  // because the Image component will fetch the image using its request without
  // the signed cookies, the access will be denied
  return (
    <main>
      <div>
        <h1>Testing Images</h1>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-1/abc/1.jpg`}
            alt="1"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-1/abc/cat1.jpg`}
            alt="cat-1"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-2/abc/2.jpg`}
            alt="2"
            style={{ objectFit: "contain" }}
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-2/abc/cat2.jpg`}
            alt="cat-2"
            style={{ objectFit: "contain" }}
          />
        </div>
      </div>
    </main>
  );
};

export default TestImage;
