import { NextPage } from "next";

const AdmimProductsListPage: NextPage = () => {
  return (
    <main>
      <div>Products list</div>
    </main>
  );
};

export default AdmimProductsListPage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
