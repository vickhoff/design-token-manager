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

interface TokenTableProps {
  type: string;
}

export function TokenTable({ type }: TokenTableProps) {
  return (
    <section className="bg-(--color-surface-default) border border-(--color-border-default) rounded p-4">
      <h2>{type}</h2>
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
