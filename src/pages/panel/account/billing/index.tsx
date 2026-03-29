import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Billing() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/panel/account/subscription");
  }, []);

  return null;
}
