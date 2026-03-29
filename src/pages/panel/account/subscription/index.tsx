import { Alert } from "@/lib/Alert";
import { NextPageWithLayout } from "@/pages/_app";
import { useGlobalProvider } from "@/providers/GlobalProvider";
import PlanService from "@/services/PlanService";
import StripeService from "@/services/StripeService";
import UserService from "@/services/UserService";
import formatMoney from "@/utils/formatMoney";
import { CheckIcon, CreditCardIcon, SparklesIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { ReactElement, useEffect, useState } from "react";
import AccountLayout from "../layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Subscription: NextPageWithLayout = () => {
  const { token, setLoading } = useGlobalProvider();
  const router = useRouter();
  const [planList, setPlanList] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (!router.isReady) return;

    const { status } = router.query;

    if (status === "success") {
      Alert.success("", "Assinatura realizada com sucesso!");
      loadData();
    } else if (status === "cancel") {
      Alert.info("", "Assinatura cancelada.");
    }
  }, [router.isReady, router.query.status]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  async function loadData() {
    setLoading(true);

    try {
      const [subResponse, planResponse] = await Promise.all([
        UserService.getUserSubscription(token!),
        PlanService.getPlanList(),
      ]);

      setSubscription(subResponse);
      setPlanList(planResponse.data);
    } catch (error: any) {
      Alert.error("", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe(planId: string) {
    setLoading(true);

    try {
      const response = await StripeService.createCheckoutSession(token!, planId);
      window.location.href = response.url;
    } catch (error: any) {
      Alert.error("", error.message ?? "Falha ao iniciar o checkout.");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCardIcon className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Assinatura atual</h2>
        </div>
        <Separator className="mb-6" />

        {subscription && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border p-5">
            <div className="flex items-center gap-4">
              <div className="relative h-12 w-12 shrink-0">
                <Image src={subscription.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
              </div>
              <div>
                <p className="font-semibold">Plano {subscription.name}</p>
                <p className="text-sm text-muted-foreground">Próximo faturamento: {subscription.nextBilling}</p>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">
                {subscription.price === 0 ? "Grátis" : formatMoney(subscription.price)}
              </span>
              {subscription.period && (
                <span className="text-sm text-muted-foreground">{subscription.period}</span>
              )}
            </div>
          </div>
        )}
      </section>

      {planList.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Planos disponíveis</h2>
          </div>
          <Separator className="mb-6" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {planList.map((plan, index) => (
              <div
                key={index}
                className={`relative flex flex-col rounded-lg border p-6 ${plan.mostPopular ? "border-primary shadow-md" : ""}`}
              >
                {plan.mostPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-xs">Mais Popular</Badge>
                  </div>
                )}

                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="relative h-12 w-12">
                    <Image src={plan.image} alt="Plano" fill sizes="48px" style={{ objectFit: "contain" }} priority />
                  </div>
                  <p className="font-semibold text-sm">Plano {plan.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                      {plan.price === 0 ? "Grátis" : formatMoney(plan.price)}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground mb-4">{plan.description}</p>

                <ul className="flex-1 space-y-2.5 mb-6">
                  {plan.features.map((feature: any) => (
                    <li key={feature.label} className="flex items-center gap-2 text-sm">
                      {feature.enabled
                        ? <CheckIcon className="h-4 w-4 shrink-0 text-green-500" />
                        : <XIcon className="h-4 w-4 shrink-0 text-muted-foreground/40" />
                      }
                      <span className={feature.enabled ? "" : "text-muted-foreground"}>{feature.label}</span>
                    </li>
                  ))}
                </ul>

                {subscription?.id === plan.id ? (
                  <Button variant="outline" className="w-full" size="sm" disabled>
                    Plano atual
                  </Button>
                ) : (
                  <Button
                    variant={plan.mostPopular ? "default" : "outline"}
                    className="w-full"
                    size="sm"
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {plan.bta}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

Subscription.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default Subscription;
