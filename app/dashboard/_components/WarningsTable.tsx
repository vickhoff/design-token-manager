import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { CircleQuestionMark } from "lucide-react";
import { Field, FieldError } from "@/components/ui/field";
import { firstLetterUpperCase } from "../../../lib/utils";
import { TableInput } from "./TableInput";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateTokenFile } from "@/lib/state/features/tokenFile/tokenFileSlice";

import { type ParseWarning } from "../../../lib/tokens/types";

interface WarningsTableProps {
  warnings: ParseWarning[];
  index: number;
}

export function WarningsTable({ warnings, index }: WarningsTableProps) {
  return (
    <section
      style={{ animationDelay: `${index * 100}ms` }}
      className="animate-in fade-in slide-in-from-top-4 duration-300 fill-mode-both bg-surface-default border border-border-warning rounded-(--radius-xl) p-4 w-full"
    >
      <h2 className="font-medium">Unidentified tokens ({warnings.length})</h2>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/5">Name</TableHead>
            <TableHead className="w-2/5">Reason</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {warnings.map((warning, i) => {
            return (
              <TableRow
                className="font-mono min-h-[64]"
                key={`${warning.property}-${i}`}
              >
                <TableCell className="min-h-[64]">
                  <span className="flex items-center gap-1.5">
                    <CircleQuestionMark
                      className="size-4 hidden md:block"
                      aria-hidden="true"
                    />
                    <code>{warning.property}</code>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    {warning.reason}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
