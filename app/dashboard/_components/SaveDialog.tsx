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

export function SaveDialog({ fileHasChanged }: { fileHasChanged: boolean }) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          fileHasChanged ? (
            <Button variant="default">Save</Button>
          ) : (
            <Tooltip>
              <TooltipTrigger
                render={
                  <span className="inline-block w-fit">
                    <Button disabled variant="default">
                      Save
                    </Button>
                  </span>
                }
              />
              <TooltipContent>
                <p>Edit a token to enable saving</p>
              </TooltipContent>
            </Tooltip>
          )
        }
      />

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save and download tokens</DialogTitle>
          <DialogDescription>
            Choose what type of file you want to save to your chosen folder.
            This will overwrite the token file.
          </DialogDescription>
        </DialogHeader>
        <form>
          <FieldGroup className="max-w-sm gap-2">
            {checkboxes.map((item, i) => (
              <FieldLabel key={item.title}>
                <Field orientation="horizontal">
                  <Checkbox
                    id={`toggle-checkbox-${i + 1}`}
                    name={`toggle-checkbox-${i + 1}`}
                  />
                  <FieldContent>
                    <FieldTitle>{item.title}</FieldTitle>
                    <FieldDescription>{item.description}</FieldDescription>
                  </FieldContent>
                </Field>
              </FieldLabel>
            ))}
          </FieldGroup>
        </form>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button type="submit">Save to file</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
