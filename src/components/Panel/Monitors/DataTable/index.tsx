"use client"

import { useState } from "react"
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { HttpStatusCodeLabel, getHttpStatusKey } from "@/types/HttpStatusCode"
import { PauseIcon, ClockFadingIcon, BadgeCheckIcon, BadgeAlertIcon, MoreHorizontal } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import styles from "./styles.module.css";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/router"
import { Alert } from "@/lib/Alert"
import { MonitorTypeEnum, MonitorTypeLabelEnum } from "@/types/MonitorTypeEnum"

interface DataTableProps<TData> {
  data: TData[]
}

export default function DataTable<TData>({ data }: DataTableProps<TData>) {
  const router = useRouter();

  const columnList: ColumnDef<any>[] = [
    {
      header: "Monitor",
      cell: ({ row }) => {
        const monitor = row.original;
        return (
          <div className="flex items-center gap-x-2">
            <MonitorFavicon address={monitor.address} />
            <div className="flex flex-col justify-center w-full overflow-hidden">
              <span className="font-medium">{monitor.name}</span>
              <small className="text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                {MonitorTypeLabelEnum[monitor.type as MonitorTypeEnum]} • {monitor.address}
              </small>
            </div>
          </div>
        )
      }
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const monitor = row.original;

        let status = null;

        if (monitor.lastStatus == null) {
          status = "Pendente";
        } else {
          if (monitor.active) {
            const label = HttpStatusCodeLabel[getHttpStatusKey(monitor.lastStatus) as keyof typeof HttpStatusCodeLabel];
            status = monitor.lastIncident ? `${label} ${monitor.lastIncident}` : label;
          } else {
            status = "Pausado";
          }
        }

        return (
          <div className="text-sm">
            <Badge variant="outline" className="flex items-center gap-1.5 px-1.5 text-muted-foreground w-fit">
              {getMonitorStatusIcon(monitor)} {status}
            </Badge>
          </div>
        )
      },
    },
    {
      header: "Tempo",
      cell: ({ row }) => {
        const monitor = row.original;
        return (
          <span>{monitor.lastDuration / 1000}s</span>
        )
      }
    },
    {
      header: "Histórico (30 dias)",
      cell: ({ row }) => {
        const monitor = row.original;
        return (
          <div className="flex items-center gap-x-1">
            <div className="flex gap-x-1">
              {monitor.historical.map((item: any, index: number) => (
                <div key={index} style={{ width: "6px", height: "20px" }} className={`${getHistoricalClass(item)} ${styles["zoom"]} rounded-lg`} title={item.note}></div>
              ))}
            </div>
            <small className="text-muted-foreground">
              {monitor.percentOnline}%
            </small>
          </div>
        )
      }
    },
    {
      header: "Intervalo",
      cell: ({ row }) => {
        const monitor = row.original;
        return (
          <div className="flex flex-col">
            <span>{monitor.interval}</span>
            <span className="text-muted-foreground">Cron {monitor.cron}</span>
          </div>
        )
      }
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const monitor = row.original;
        return (
          <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push(`/panel/monitors/edit/${monitor.id}`)}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopyClick(monitor.address)}>Copiar URL</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    }
  ]

  const table = useReactTable({
    data,
    columns: columnList,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer"
                onClick={() => router.push(`/panel/monitors/edit/${row.original.id}`)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnList.length} className="h-24 text-center">
                Nenhum monitor encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

async function handleCopyClick(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    Alert.success("", "Copiado para área de transferência");
  } catch { }
}

function getHistoricalClass(item: any) {
  if (item.percentOnline + item.percentOffline == 0) {
    return styles["bg-empty"];
  } else if (item.percentOnline == 100) {
    return styles["bg-success"];
  } else if (item.percentOnline >= 50) {
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
    <img src={faviconUrl} width={16} height={16} alt="" onError={() => setVisible(false)} className="rounded" />
  );
}

function getMonitorStatusIcon(monitor: any) {
  if (monitor.active == false) {
    return <span title="Inativo/Pausado"><PauseIcon size={14} className={styles["font-empty"]} /></span>
  }
  if (monitor.lastStatus == null) {
    return <span title="Pendente"><ClockFadingIcon size={14} className={styles["font-empty"]} /></span>
  }
  return monitor.lastStatus?.startsWith("2")
    ? <span title="Disponível"><BadgeCheckIcon size={14} className={styles["font-success"]} /></span>
    : <span title="Indisponível"><BadgeAlertIcon size={14} className={styles["font-danger"]} /></span>
}
