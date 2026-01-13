import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";
import { buttonVariants } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { auth } from "@/lib/auth";
import { UserDropdown } from "./UserDropdown";

const Navbar = async () => {
  const session = await auth();
  return (
    <nav className="flex items-center justify-between py-5">
      <Link href="/" className="flex items-center gap-2">
        <Image src={Logo} alt="Job List Logo" width={40} height={40} />
        <h1 className="text-2xl font-bold">
          Job<span className="text-primary">List</span>
        </h1>
      </Link>
      <div className="hidden md:flex items-center gap-5">
        <ThemeToggle />
        <Link href="/post-job" className={buttonVariants({ size: "lg" })}>
          Post Job
        </Link>
        {session?.user ? (
          <UserDropdown
            email={session.user.email as string}
            name={session.user.name as string}
            image={session.user.image as string}
          />
        ) : (
          <Link
            href="/login"
            className={buttonVariants({ variant: "outline", size: "lg" })}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
