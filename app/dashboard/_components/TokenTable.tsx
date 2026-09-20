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
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateTokenFile } from "@/lib/state/features/tokenFile/tokenFileSlice";

interface TokenTableProps {
  type: string;
  tokens: Token[];
  index: number;
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

export function TokenTable({ type, tokens, index }: TokenTableProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [colorValues, setColorValues] = useState<Record<string, string>>({});
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();

  return (
    <section
      style={{ animationDelay: `${index * 100}ms` }}
      className="animate-in fade-in slide-in-from-top-4 duration-300 fill-mode-both bg-surface-default border border-border-default rounded-(--radius-xl) p-4 w-full"
    >
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
            const inputVariant = token.type === "color" ? "color" : "default";
            const originalDisplayValue =
              typeof token.value === "object"
                ? `${token.value.value}${token.value.unit}`
                : String(token.value);
            const displayValue = inputValues[token.id] ?? originalDisplayValue;
            return (
              <TableRow className="font-mono min-h-[64]" key={token.id}>
                <TableCell className="min-h-[64]">
                  <span className="flex items-center gap-1.5">
                    {renderIcon(token.type as string)}
                    <code>{token.id}</code>
                  </span>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1.5">
                    <Field>
                      <TableInput
                        className="max-w-[280]"
                        variant={inputVariant}
                        colorValue={
                          inputVariant === "color"
                            ? (colorValues[token.id] ?? (token.value as string))
                            : undefined
                        }
                        value={displayValue}
                        onChange={(e) => {
                          setInputValues((prev) => ({
                            ...prev,
                            [token.id]: e.target.value,
                          }));
                        }}
                        aria-invalid={Boolean(errors[token.id])}
                        onBlur={(e) => {
                          const result = parseValue(token.type, e.target.value);
                          if (!result.ok) {
                            setInputValues((prev) => ({
                              ...prev,
                              [token.id]: displayValue,
                            }));
                            setErrors((prev) => ({
                              ...prev,
                              [token.id]: result.reason,
                            }));
                          } else {
                            if (inputVariant === "color") {
                              setColorValues((prev) => ({
                                ...prev,
                                [token.id]: result.value as string,
                              }));
                            }

                            dispatch(
                              updateTokenFile({
                                id: token.id,
                                value: result.value,
                              }),
                            );

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
