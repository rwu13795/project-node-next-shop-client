import { NextPage } from "next";
import Image from "next/image";

const TestImage: NextPage = ({}) => {
  console.log(
    `${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/2.jpg`
  );

  return (
    <main>
      <div>
        <h1>Testing Images</h1>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-1/abc/1.jpg`}
            alt="1"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-1/abc/cat1.jpg`}
            alt="cat-1"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-2/abc/2.jpg`}
            alt="2"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing-2/abc/cat2.jpg`}
            alt="cat-2"
          />
        </div>
      </div>
    </main>
  );
};

export default TestImage;
