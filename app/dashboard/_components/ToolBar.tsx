import Link from "next/link";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowLeft } from "lucide-react";

function ToolBar() {
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
      <ThemeToggle />
    </div>
  );
}

export default ToolBar;
