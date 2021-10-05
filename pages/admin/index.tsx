import { NextPage } from "next";

const AdminHomePage: NextPage = () => {
  return (
    <main>
      <div>Products list</div>
    </main>
  );
};

export default AdminHomePage;

export function getStaticProps() {
  return { props: { page: "admin" } };
}
