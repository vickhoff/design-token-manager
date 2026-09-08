"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";

import { clearTokenFile } from "@/lib/state/features/tokenFile/tokenFileSlice";

import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group";

function ToolBar() {
  const rawFile = useAppSelector((state) => state.tokenFile.rawFile);
  const jsonFile = useAppSelector((state) => state.tokenFile.jsonFile);
  const isLoaded = jsonFile !== null;
  const dispatch = useAppDispatch();

  function handleReset() {
    dispatch(clearTokenFile());
  }
  console.log(rawFile);
  return (
    <div className="flex border rounded-lg p-4 justify-between items-center p-4 m-2">
      <Button
        nativeButton={false}
        render={<Link href="/"></Link>}
        variant="ghost"
        size="icon"
      >
        <ArrowLeft />
      </Button>
      <Logo />
      {isLoaded && (
        <ButtonGroup aria-label="Button group">
          <Button onClick={handleReset} variant="outline" size="icon">
            <X />
          </Button>
          <ButtonGroupText
            render={<Label className="font-mono" htmlFor="name" />}
          >
            {rawFile?.title}
          </ButtonGroupText>
        </ButtonGroup>
      )}
      <ThemeToggle />
    </div>
  );
}

export default ToolBar;
