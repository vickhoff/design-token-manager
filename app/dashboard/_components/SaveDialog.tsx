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
  title: string;
  description: string;
};

const checkboxes: CheckBox[] = [
  {
    title: "JSON file",
    description: "Save a tokens.json to the folder you choose",
  },
  {
    title: "CSS file",
    description: "Save a tokens.css file to the folder you choose",
  },
];

function renderButtonWithDisabledTooltip(
  isDisabled: boolean,
  buttonText: string,
  tooltipText: string,
  type?: React.ComponentProps<typeof Button>["type"],
): ReactElement {
  return isDisabled ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <span className="inline-block w-fit">
            <Button type={type} disabled variant="default">
              {buttonText}
            </Button>
          </span>
        }
      />
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  ) : (
    <Button variant="default" type={type}>
      {buttonText}
    </Button>
  );
}

interface SaveDialogProps {
  tokens: Token[];
  fileHasChanged: boolean;
}

export function SaveDialog({ tokens, fileHasChanged }: SaveDialogProps) {
  const [selectedFormats, setSelectedFormats] = useState<
    Record<string, boolean>
  >({
    "JSON file": true,
    "CSS file": true,
  });

  function handleSave() {
    const formats = {
      json: selectedFormats["JSON file"],
      css: selectedFormats["CSS file"],
    };

    try {
      saveTokenFile(tokens, formats);
      console.log(formats);
    } catch (error) {
      error;
    }
  }

  const nothingToSave = !fileHasChanged;
  const noFormatSelected = Object.values(selectedFormats).every((v) => !v);

  return (
    <Dialog>
      <DialogTrigger
        render={renderButtonWithDisabledTooltip(
          nothingToSave,
          "Save",
          "Edit a token to enable saving",
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
                    checked={selectedFormats[item.title]}
                    onCheckedChange={(checked) =>
                      setSelectedFormats((prev) => ({
                        ...prev,
                        [item.title]: checked,
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
              "submit",
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
