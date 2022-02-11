import { NextPage } from "next";

const TestImage: NextPage = ({}) => {
  return (
    <main>
      <div>
        <h1>Testing image</h1>
        <div>
          <img
            src={`https://cdn.node-next-shop-rw.store/users/3.jpg`}
            alt="3"
          />
        </div>
        <div>
          <img
            src={`https://cdn.node-next-shop-rw.store/fake/1.jpg`}
            alt="fake"
          />
        </div>
        <div>
          <img
            src={`https://cdn.node-next-shop-rw.store/groups/2.jpg`}
            alt="2"
          />
        </div>

        {/* <img src={`https://cdn.node-next-shop-rw.store/cat1.jpg`} alt="1" /> */}
        {/* <img src={signedUrl} alt="signedUrl" /> */}
      </div>
    </main>
  );
};

export default TestImage;
