import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, ReactElement } from "react";
import { BadgeCheckIcon, BadgeAlertIcon, ClockFadingIcon, CircleAlertIcon, TriangleAlertIcon, InfoIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { HttpStatusCodeLabel, getHttpStatusKey } from "@/types/HttpStatusCode";
import StatusPageService from "@/services/StatusPageService";
import { NextPageWithLayout } from "../_app";
import styles from "@/components/Panel/Monitors/DataTable/styles.module.css";
import Logo from "@/components/Logo";

const REFRESH_INTERVAL = 60;

type HistoricalDay = {
  date: string;
  totalOnline: number;
  totalOffline: number;
  percentOnline: number;
  percentOffline: number;
  note: string;
};

type Monitor = {
  id: string;
  name: string;
  type: string;
  address: string;
  interval: string;
  lastStatus: string | null;
  lastDuration: number | null;
  lastIncident: string | null;
  historical: HistoricalDay[];
  percentOnline: number;
};

type StatusPageData = {
  title: string;
  monitors: Monitor[];
};

function getOverallStatus(monitors: Monitor[]): "operational" | "partial" | "outage" | "empty" {
  if (monitors.length === 0) {
    return "empty";
  }
  const withStatus = monitors.filter((m) => m.lastStatus !== null);
  if (withStatus.length === 0) {
    return "empty";
  }
  const down = withStatus.filter((m) => !m.lastStatus!.startsWith("2"));
  if (down.length === 0) {
    return "operational";
  }
  if (down.length < withStatus.length) {
    return "partial";
  }
  return "outage";
}

function getHistoricalClass(item: HistoricalDay) {
  if (item.percentOnline + item.percentOffline === 0) {
    return styles["bg-empty"];
  }
  if (item.percentOnline === 100) {
    return styles["bg-success"];
  }
  if (item.percentOnline >= 50) {
    return styles["bg-partial"];
  }
  return styles["bg-danger"];
}

function MonitorFavicon({ address }: { address: string }) {
  const [visible, setVisible] = useState(true);
  let faviconUrl = "";
  try {
    const url = new URL(address);
    faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=16`;
  } catch {
    faviconUrl = "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=16";
  }

  if (!visible) {
    return <span style={{ width: 16, display: "inline-block" }} />;
  }

  return (
    <img
      src={faviconUrl}
      width={16}
      height={16}
      alt=""
      onError={() => setVisible(false)}
      className="rounded"
    />
  );
}

function MonitorStatusLabel({ monitor }: { monitor: Monitor }) {
  if (monitor.lastStatus === null) {
    return null;
  }
  const label = HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel];
  const text = monitor.lastIncident ? `${label} • ${monitor.lastIncident}` : label;
  return (
    <span className="text-xs text-muted-foreground">{text}</span>
  )
}

function MonitorStatusBadge({ monitor }: { monitor: Monitor }) {
  if (monitor.lastStatus === null) {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 px-1.5 text-muted-foreground w-fit text-xs">
        <ClockFadingIcon size={12} className={styles["font-empty"]} />
        Pendente
      </Badge>
    );
  }
  if (monitor.lastStatus.startsWith("2")) {
    return (
      <Badge variant="outline" className="flex items-center gap-1.5 px-1.5 text-muted-foreground w-fit text-xs">
        <BadgeCheckIcon size={12} className={styles["font-success"]} />
        Operacional
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="flex items-center gap-1.5 px-1.5 text-muted-foreground w-fit text-xs">
      <BadgeAlertIcon size={12} className={styles["font-danger"]} />
      Indisponível
    </Badge>
  );
}

const StatusPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query as { slug: string };

  const [data, setData] = useState<StatusPageData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL);

  const fetchData = useCallback(async (currentSlug: string) => {
    try {
      const response = await StatusPageService.getPublicStatusPage(currentSlug);
      setData(response);
      setLastUpdated(new Date());
      setCountdown(REFRESH_INTERVAL);
    } catch (error: any) {
      if (error?.status === 404) {
        setNotFound(true);
      }
    }
  }, []);

  useEffect(() => {
    if (!slug) return;
    fetchData(slug);
  }, [slug, fetchData]);

  useEffect(() => {
    if (!slug || notFound) return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          fetchData(slug);
          return REFRESH_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [slug, notFound, fetchData]);

  const overallStatus = data ? getOverallStatus(data.monitors) : "empty";

  const overallConfig = {
    operational: {
      label: "Todos os sistemas operacionais",
      bg: "bg-[#05DF72]/10",
      border: "border-[#05DF72]/30",
      text: "text-[#05DF72]",
      Icon: BadgeCheckIcon,
    },
    partial: {
      label: "Alguns sistemas estão indisponíveis",
      bg: "bg-[#FDC700]/10",
      border: "border-[#FDC700]/30",
      text: "text-[#FDC700]",
      Icon: TriangleAlertIcon,
    },
    outage: {
      label: "Todos os sistemas indisponíveis",
      bg: "bg-[#FF6467]/10",
      border: "border-[#FF6467]/30",
      text: "text-[#FF6467]",
      Icon: CircleAlertIcon,
    },
    empty: {
      label: "Sem dados de monitoramento",
      bg: "bg-muted/40",
      border: "border-border",
      text: "text-muted-foreground",
      Icon: InfoIcon,
    },
  }[overallStatus];

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-4">
        <Head>
          <title>Página não encontrada • Systatus.Live</title>
        </Head>
        <p className="text-4xl font-bold">404</p>
        <p className="text-muted-foreground">Página de status não encontrada.</p>
        <Link href="/" className="text-sm text-primary underline underline-offset-4">
          Voltar ao início
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data ? `${data.title} • Status` : "Status • Systatus.Live"}</title>
      </Head>

      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border">
          <div className="max-w-3xl mx-auto px-4 py-5 flex items-center justify-between">
            <div>
              {data ? (
                <h1 className="text-lg font-semibold">{data.title}</h1>
              ) : (
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
              )}
            </div>
            <Logo iconOnly={true} />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-6">
          {data ? (
            <Alert className={`${overallConfig.bg} ${overallConfig.border}`}>
              <AlertTitle className={overallConfig.text}>{overallConfig.label}</AlertTitle>
            </Alert>
          ) : (
            <div className="h-14 w-full bg-muted animate-pulse rounded-xl" />
          )}

          <div className="flex flex-col gap-1">
            {data && data.monitors.length > 0 && (
              <p className="text-xs text-muted-foreground mb-1">Últimos 30 dias</p>
            )}
            {data ? (
              data.monitors.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Nenhum monitor configurado.
                </p>
              ) : (
                data.monitors.map((monitor, idx) => (
                  <div key={monitor.id}>
                    {idx > 0 && <Separator />}
                    <div className="py-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2 min-w-0">
                          <MonitorFavicon address={monitor.address} />
                          <span className="font-medium text-sm truncate">
                            {monitor.name}
                          </span>
                          <span className="text-muted-foreground text-xs hidden sm:block truncate">
                            {monitor.address}
                          </span>
                        </div>
                        <MonitorStatusBadge monitor={monitor} />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-px flex-1">
                          {monitor.historical.map((item, i) => (
                            <div
                              key={i}
                              className={`flex-1 h-6 rounded-sm ${getHistoricalClass(item)} ${styles["zoom"]}`}
                              title={item.note}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                          {monitor.percentOnline}%
                        </span>
                      </div>
                      <MonitorStatusLabel monitor={monitor} />
                    </div>
                  </div>
                ))
              )
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="py-4 flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                    <div className="h-5 w-20 bg-muted animate-pulse rounded-full" />
                  </div>
                  <div className="flex gap-px">
                    {Array.from({ length: 30 }).map((_, j) => (
                      <div key={j} className="flex-1 h-6 rounded-sm bg-muted animate-pulse" />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
        <footer className="border-t border-border">
          <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {lastUpdated
                ? `Atualizado às ${lastUpdated.toLocaleTimeString("pt-BR")} · Próxima atualização em ${countdown}s`
                : "Carregando..."}
            </span>
            <Link href="/" className="hover:text-foreground transition-colors">
              Monitorado por Systatus.Live
            </Link>
          </div>
        </footer>
      </div>
    </>
  );
};

StatusPage.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default StatusPage;
