import { NextPage } from "next";

const AdmimHomePage: NextPage = () => {
  return (
    <main>
      <div>Home page</div>
    </main>
  );
};

export default AdmimHomePage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
