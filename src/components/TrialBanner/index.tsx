import { AlertTriangleIcon } from "lucide-react";
import momentTz from "moment-timezone";
import { AlertTitle, AlertDescription, Alert } from "../ui/alert";
import Link from "next/link";

interface TrialBannerProps {
  endDate: string;
}

export function TrialBanner({ endDate }: TrialBannerProps) {
  const now = momentTz().tz("America/Sao_Paulo");
  const end = momentTz(endDate).tz("America/Sao_Paulo");
  const daysLeft = end.diff(now, "days");

  const label = daysLeft <= 0 ? "Seu trial vence hoje" : daysLeft === 1 ? "Seu trial vence amanhã" : `Seu trial vence em ${daysLeft} dias`;

  return (
    <Alert className="w-full border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50">
      <AlertTriangleIcon />
      <AlertTitle>
        <span className="mr-2">{label}</span>
        <Link href="/panel/account/subscription" className="underline underline-offset-2 whitespace-nowrap font-semibold">
          Assinar agora
        </Link>
      </AlertTitle>
    </Alert>
  )
}
