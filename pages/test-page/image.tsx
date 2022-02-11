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
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-1/1.jpg`}
            alt="test-1"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-1/cat2.jpg`}
            alt="test-1"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/2.jpg`}
            alt="test-1"
          />
        </div>

        <div style={{ width: "300px", height: "300px" }}>
          <img
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/cat3.jpg`}
            alt="test-1"
          />
        </div>
      </div>
    </main>
  );
};

export default TestImage;
