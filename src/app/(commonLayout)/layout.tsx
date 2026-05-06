

export default async function CommonLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <>
      {/* <Navbar initialUser={user} /> */}
      <main className="min-h-[calc(100vh-4rem)] ">
        {children}
      </main>
      {/* <Footer></Footer> */}
    </>
  );
}
