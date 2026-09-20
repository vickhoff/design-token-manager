"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Spinner } from "@/components/ui/spinner";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldContent,
  FieldTitle,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";

import { ReactElement, useState } from "react";
import { saveTokenFile } from "@/lib/tokenFileSystem";

import type { Token } from "@/lib/tokens/types";

type CheckBox = {
  key: "json" | "css";
  title: string;
  description: string;
};

const checkboxes: CheckBox[] = [
  {
    key: "json",
    title: "JSON file",
    description: "Save a tokens.json to the folder you choose",
  },
  {
    key: "css",
    title: "CSS file",
    description: "Save a tokens.css file to the folder you choose",
  },
];

function renderButtonWithDisabledTooltip(
  isDisabled: boolean,
  buttonText: string,
  tooltipText: string,
  isLoading: boolean,
  type?: React.ComponentProps<typeof Button>["type"],
): ReactElement {
  return isDisabled ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-block w-fit">
            <Button type={type} disabled variant="default">
              {isLoading ? <Spinner /> : buttonText}
            </Button>
          </span>
        }
      />
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button
      variant="default"
      type={type}
      className="relative"
      disabled={isLoading}
    >
      <span className={isLoading ? "invisible" : undefined}>{buttonText}</span>
      {isLoading && <Spinner className="absolute inset-0 m-auto" />}
    </Button>
  );
}

interface SaveDialogProps {
  tokens: Token[];
  fileHasChanged: boolean;
}

export function SaveDialog({ tokens, fileHasChanged }: SaveDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<
    Record<CheckBox["key"], boolean>
  >({
    json: true,
    css: true,
  });

  async function handleSave(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setIsLoading(true);
      await saveTokenFile(tokens, selectedFormats);
      setIsLoading(false);
      setOpen(false);
    } catch (error) {
      console.log(error);
    }
  }

  const nothingToSave = !fileHasChanged;
  const noFormatSelected = Object.values(selectedFormats).every((v) => !v);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={renderButtonWithDisabledTooltip(
          nothingToSave,
          "Save",
          "Edit a token to enable saving",
          false,
        )}
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save and download tokens</DialogTitle>
          <DialogDescription>
            Choose what type of file you want to save to your chosen folder.
            This will overwrite the token file.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSave}>
          <FieldGroup className="max-w-sm gap-2">
            {checkboxes.map((item, i) => (
              <FieldLabel key={item.title}>
                <Field orientation="horizontal">
                  <Checkbox
                    id={`toggle-checkbox-${i + 1}`}
                    name={`toggle-checkbox-${i + 1}`}
                    checked={selectedFormats[item.key]}
                    onCheckedChange={(checked) =>
                      setSelectedFormats((prev) => ({
                        ...prev,
                        [item.key]: checked,
                      }))
                    }
                  />

                  <FieldContent>
                    <FieldTitle>{item.title}</FieldTitle>
                    <FieldDescription>{item.description}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            {renderButtonWithDisabledTooltip(
              noFormatSelected,
              "Save to file",
              "Choose at least one option",
              isLoading,
              "submit",
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
