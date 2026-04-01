import { AppNav } from "@/components/ui/app-nav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppNav />
      <main className="pt-14">{children}</main>
    </>
  );
}
