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

export function TokenTable() {
  return (
    <>
      <h2>Color</h2>
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
              <TableInput placeholder="token.name" />
            </TableCell>
            <TableCell>
              <TableInput placeholder="#ffffff" />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
}
