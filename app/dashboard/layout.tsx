import ToolBar from "./_components/ToolBar";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <ToolBar />
      {children}
    </>
  );
}
