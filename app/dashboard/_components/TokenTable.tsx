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
import { Field, FieldError } from "@/components/ui/field";
import { type Token } from "../../../lib/tokens/types";
import { firstLetterUpperCase } from "../../../lib/utils";
import { Palette, Type, SquareDashed, CircleQuestionMark } from "lucide-react";
import { TableInput } from "./TableInput";
import { parseValue } from "@/lib/tokens/parseTokensCss";
import { useState } from "react";

interface TokenTableProps {
  type: string;
  tokens: Token[];
}

function renderIcon(type: string) {
  switch (type) {
    case "color":
      return <Palette className="size-4 hidden md:block" aria-hidden="true" />;
    case "typography":
      return <Type className="size-4 hidden md:block" aria-hidden="true" />;
    case "dimension":
      return (
        <SquareDashed className="size-4 hidden md:block" aria-hidden="true" />
      );
    default:
      return (
        <CircleQuestionMark
          className="size-4 hidden md:block"
          aria-hidden="true"
        />
      );
  }
}

export function TokenTable({ type, tokens }: TokenTableProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  return (
    <section className="bg-surface-default border border-border-default rounded-(--radius-xl) p-4 w-full">
      <h2 className="font-medium">
        {firstLetterUpperCase(type)} ({tokens.length})
      </h2>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-3/5">Name</TableHead>
            <TableHead className="w-2/5">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((token) => {
            const displayValue =
              typeof token.value === "object"
                ? `${token.value.value}${token.value.unit}`
                : String(token.value);
            return (
              <TableRow className="font-mono" key={token.id}>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    {renderIcon(token.type as string)}
                    <code>{token.id}</code>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    {token.type === "color" ? (
                      <div
                        className="w-4 h-4 rounded-sm border border-border-default"
                        style={{ backgroundColor: token.value as string }}
                      />
                    ) : null}
                    <Field>
                      <TableInput
                        defaultValue={displayValue}
                        aria-invalid={Boolean(errors[token.id])}
                        onBlur={(e) => {
                          const result = parseValue(token.type, e.target.value);
                          if (!result.ok) {
                            e.target.value = displayValue;
                            setErrors((prev) => ({
                              ...prev,
                              [token.id]: result.reason,
                            }));
                          } else {
                            console.log(result.value);
                            setErrors((prev) => {
                              const { [token.id]: _removed, ...rest } = prev;
                              return rest;
                            });
                          }
                        }}
                      />
                      <FieldError>{errors[token.id]}</FieldError>
                    </Field>
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
