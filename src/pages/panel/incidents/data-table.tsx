"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { HttpStatusCodeLabel, getHttpStatusKey } from "@/types/HttpStatusCode";
import { BadgeCheckIcon, BadgeAlertIcon } from "lucide-react";
import formatDate from "@/utils/formatDate";
import styles from "./styles.module.css";

interface DataTableProps<TData> {
  data: TData[];
}

export function DataTable<TData>({ data }: DataTableProps<TData>) {
  const columnList: ColumnDef<any>[] = [
    {
      header: "Status",
      cell: ({ row }) => {
        const incident = row.original;
        if (incident.endedAt) {
          return (
            <div className="flex items-center gap-1.5">
              <BadgeCheckIcon size={16} className={styles["font-success"]} />
              <span className="text-sm">Resolvido</span>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-1.5">
            <BadgeAlertIcon size={16} className={`${styles["font-danger"]} ${styles["blink"]}`} />
            <span className="text-sm">Não Resolvido</span>
          </div>
        );
      },
    },
    {
      header: "Monitor",
      cell: ({ row }) => {
        const incident = row.original;
        return (
          <div className="flex flex-col justify-center">
            <span className="font-medium">{incident.name}</span>
            <small className="text-muted-foreground">{incident.address}</small>
          </div>
        );
      },
    },
    {
      header: "Incidente",
      cell: ({ row }) => {
        const incident = row.original;
        return (
          <span className="text-sm">
            {HttpStatusCodeLabel[getHttpStatusKey(incident.lastError) as keyof typeof HttpStatusCodeLabel]}
          </span>
        );
      },
    },
    {
      header: "Iniciado",
      cell: ({ row }) => (
        <span className="text-sm">{formatDate(row.original.createdAt, "DD/MM/YYYY HH:mm")}</span>
      ),
    },
    {
      header: "Resolvido",
      cell: ({ row }) => {
        const incident = row.original;
        if (incident.endedAt) {
          return <span className="text-sm">{formatDate(incident.endedAt, "DD/MM/YYYY HH:mm")}</span>;
        }
        return <span className="text-sm text-muted-foreground">Em andamento</span>;
      },
    },
    {
      header: "Duração",
      cell: ({ row }) => (
        <span className="text-sm">{row.original.duration || "—"}</span>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns: columnList,
    getCoreRowModel: getCoreRowModel(),
  });

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
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
                Nenhum incidente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
