"use client"

import { Alert } from "@/lib/Alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";

interface DataTableProps<TData> {
  data: TData[];
  onValidate: (id: string) => void;
}

export default function DataTable<TData>({ data, onValidate }: DataTableProps<TData>) {
  const router = useRouter();

  const columnList: ColumnDef<any>[] = [
    {
      header: "Integração",
      cell: ({ row }) => {
        const integration = row.original;
        return (
          <div className="flex items-center gap-3">
            <Image
              src={integration.chatPlatformIconUrl}
              alt=""
              width={18}
              height={18}
              className="shrink-0"
            />
            <div className="flex flex-col justify-center overflow-hidden">
              <span className="font-medium">{integration.name}</span>
              <small className="text-muted-foreground overflow-hidden whitespace-nowrap text-ellipsis">
                {integration.chatPlatform} • {integration.address}
              </small>
            </div>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const integration = row.original;
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
                <DropdownMenuItem onClick={() => router.push(`/panel/integrations/edit/${integration.id}`)}>
                  Editar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onValidate(integration.id)}>
                  Testar integração
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleCopyClick(integration.address)}>
                  Copiar URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
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
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="cursor-pointer"
                onClick={() => router.push(`/panel/integrations/edit/${row.original.id}`)}
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
                Nenhuma integração encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

async function handleCopyClick(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    Alert.success("", "Copiado para área de transferência");
  } catch {}
}
