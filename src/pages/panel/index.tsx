import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/panel/monitors",
      permanent: false,
    },
  };
};

const Panel = () => {
  return null;
};

export default Panel;