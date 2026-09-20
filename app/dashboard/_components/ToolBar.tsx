"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { DropdownMenuThemeSwitchItem } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";
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

function ToolBar() {
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
            <Link href="/">
              <DropdownMenuItem variant="destructive">
                Sign out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default ToolBar;
