import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/panel/account/details",
      permanent: false,
    },
  };
};

const Account = () => {
  return null;
};

export default Account;