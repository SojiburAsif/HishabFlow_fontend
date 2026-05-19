import Footer from "@/components/shared/Fooder/Fooder";
import Navbar from "@/components/shared/Navbar/Navbar";

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="">
        {children}
      </main>
      <Footer></Footer>
    </>
  );
}
