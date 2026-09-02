import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { TableInput } from "./TableInput";
import { type Token } from "../../../lib/tokens/types";
import { firstLetterUpperCase } from "../../../lib/utils";

interface TokenTableProps {
  type: string;
  tokens: Token[];
}

export function TokenTable({ type, tokens }: TokenTableProps) {
  return (
    <section className="bg-(--color-surface-default) border border-(--color-border-default) rounded-(--radius-xl) p-4 w-full">
      <h2>{firstLetterUpperCase(type)}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <p>color.surface.default</p>
            </TableCell>
            <TableCell>
              <TableInput placeholder="#ffffff" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
}
