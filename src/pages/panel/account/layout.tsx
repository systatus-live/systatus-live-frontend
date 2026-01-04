import Loading from "@/components/Loading";
import { useState } from "react";
import PanelLayout from "../layout";

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <>
      {isSubmitting && <Loading />}

      <PanelLayout>
        {children}
      </PanelLayout>
    </>
  )
}