import { NextPage } from "next";

const TestImage: NextPage = ({}) => {
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
        {/* <img src={signedUrl} alt="signedUrl" /> */}
      </div>
    </main>
  );
};

export default TestImage;
