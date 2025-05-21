import Link from "next/link";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen flex flex-col justify-center items-center">
      {children}
      <Link
        href="/"
        className="hover:underline hover:text-orange-400 transition-all duration-300"
      >
        Go back
      </Link>
    </main>
  );
}
