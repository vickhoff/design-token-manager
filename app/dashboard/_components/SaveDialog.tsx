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
    description: "Save a JSON file with your tokens",
  },
  {
    title: "CSS file",
    description: "Save a CSS file with your tokens",
  },
];

export function SaveDialog() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="default">Save</Button>} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Save and download tokens</DialogTitle>
          <DialogDescription>
            Choose what type of file you want to download to your local folder
          </DialogDescription>
        </DialogHeader>
        <form>
          <FieldGroup className="max-w-sm gap-2">
            {checkboxes.map((item, i) => (
              <FieldLabel>
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
