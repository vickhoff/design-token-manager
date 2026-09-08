"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { DropdownMenuThemeSwitchItem } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { clearTokenFile } from "@/lib/state/features/tokenFile/tokenFileSlice";

function ToolBar() {
  const rawFile = useAppSelector((state) => state.tokenFile.rawFile);
  const dispatch = useAppDispatch();

  function handleReset() {
    dispatch(clearTokenFile());
  }
  return (
    <div className="grid grid-cols-3 items-center border bg-surface-default rounded-lg p-4 m-2">
      <div className="justify-self-start">
        <Button
          nativeButton={false}
          render={<Link href="/"></Link>}
          variant="ghost"
          size="icon"
        >
          <ArrowLeft />
        </Button>
      </div>

      <Logo className="justify-self-center" />

      <div className="justify-self-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost">
                <Avatar size="sm">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                David Vickhoff
              </Button>
            }
          ></DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuThemeSwitchItem />
            <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ToolBar;
