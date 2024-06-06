import Component from "@/components/component/book-report";
import dynamic from "next/dynamic";

export default function Home() {
  const ClientSideComponent = dynamic(() => import('@/components/component/book-report'), {
    ssr: false,
  })
  return (
<main className="flex min-h-screen flex-col items-center justify-between p-6 sm:p-12 md:p-24 lg:p-24">
      <ClientSideComponent />
    </main>
  );
}
