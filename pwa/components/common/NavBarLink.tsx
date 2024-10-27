import Link from "next/link";
import React from "react";

const NavBarLink = ({href, children}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="px-4 py-2 rounded-md shadow text-white  hover:bg-secondary">{children}</Link>
)

export default NavBarLink
