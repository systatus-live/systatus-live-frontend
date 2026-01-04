import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/panel/dashboard",
      permanent: false,
    },
  };
};

const Panel = () => {
  return null;
};

export default Panel;