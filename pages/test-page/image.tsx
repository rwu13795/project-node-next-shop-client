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
        {/* <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-1/1.jpg`}
            alt="test-1"
            width={300}
            height={500}
          />
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-1/cat2.jpg`}
            alt="test-1"
            width={300}
            height={300}
          />
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/2.jpg`}
            alt="test-2"
            width={300}
            height={500}
          />
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-2/cat3.jpg`}
            alt="test-1"
            width={300}
            height={300}
          />
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/test-3/3.jpg`}
            alt="This image cannot be accessed. Server did not provide the cookie on purpose"
            width={300}
            height={500}
          />
        </div>
        <div>
          <Image
            src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/testing/cat1.jpg`}
            alt="This image cannot be accessed. Server did not provide the cookie on purpose"
            width={300}
            height={300}
          />
        </div> */}
        <img
          src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/users/3.jpg`}
          alt="users"
          // width={300}
          // height={300}
        />
        <img
          src={`${process.env.NEXT_PUBLIC_CLOUD_FRONT_URL}/groups/2.jpg`}
          alt="groups"
          // width={300}
          // height={300}
        />
      </div>
    </main>
  );
};

export default TestImage;
