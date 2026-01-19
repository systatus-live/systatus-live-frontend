import Loading from "@/components/Loading";
import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import PlanService from "@/services/PlanService";
import { CheckIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { ReactElement, useEffect, useState } from "react";
import AccountLayout from "../layout";
import styles from "./styles.module.scss";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import UserService from "@/services/UserService";

const AccountSubscription: NextPageWithLayout = () => {
  const { token } = useGlobalProvider();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [planList, setPlanList] = useState<any[]>([]);
  const [plan, setPlan] = useState<any>(null);

  useEffect(() => {
    if (token) {
      (async () => {
        await getPlanList();
        await getUserPlan();
      })();
    }
  }, [token]);

  async function getPlanList() {
    setIsSubmitting(true);
    try {
      const response = await PlanService.getPlanList();
      setPlanList(response.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function getUserPlan() {
    setIsSubmitting(true);
    try {
      const response = await UserService.getUserPlan(token as string);
      setPlan(response);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {isSubmitting && <Loading />}

      {plan == null ? <></> :
        <Panel header="Assinatura atual">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div style={{ width: 58, height: 58, position: "relative", overflow: "hidden" }}>
                <Image src={plan.image} alt="Plano" fill sizes={`${58}px`} style={{ objectFit: "contain" }} priority />
              </div>
              <div>
                <span className="font-bold">Plano {plan.name}</span>
                <div>
                  <span className="text-sm">Próximo faturamento: {plan.nextBilling}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-baseline mt-2">
              <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-xl font-medium text-gray-500 ml-1">{plan.period}</span>}
            </div>
          </div>
        </Panel>
      }

      <Panel header="Planos disponíveis" className="mt-6">
        <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8">
          {planList.map((plan, index) => (
            <div key={index} className={`relative flex flex-col rounded-2xl shadow-xl overflow-hidden ${plan.mostPopular ? 'border-2 border-blue-400' : 'border border-gray-200'} p-6 `}>
              <div>
                <div>
                  <div className="flex justify-center">{plan.mostPopular ? <span className={styles["most-popular"]}>🌟 Mais Popular 🌟</span> : <></>}</div>
                  <div className="flex flex-col items-center">
                    <div style={{ width: 58, height: 58, position: "relative", overflow: "hidden" }}>
                      <Image src={plan.image} alt="Plano" fill sizes={`${58}px`} style={{ objectFit: "contain" }} priority />
                    </div>
                    <h1 className="font-semibold text-gray-900 mt-2">Plano {plan.name}</h1>
                  </div>
                  <div className="flex justify-center items-baseline mt-2">
                    <span className="text-4xl font-extrabold tracking-tight text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-xl font-medium text-gray-500 ml-1">{plan.period}</span>}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-2 mt-2 rounded-lg">
                <h3 className="text-center text-gray-500 mb-6">{plan.description}</h3>
                <ul className="space-y-4">
                  {Object.entries(plan.features).map(([key, included], index) => (
                    <li key={index} className="flex items-start">
                      {included ? <CheckIcon className="flex-shrink-0 h-5 w-5 text-green-500" /> : <XIcon className="flex-shrink-0 h-5 w-5 text-gray-400" />}
                      <span className={`ml-3 ${included ? "text-gray-700" : "text-gray-400"}`}>{key}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 p-fluid">
                  <Link href={plan.btaLink}>
                    <Button>{plan.bta}</Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  )
}

AccountSubscription.getLayout = function getLayout(page: ReactElement) {
  return (
    <AccountLayout>
      {page}
    </AccountLayout>
  )
}

export default AccountSubscription;