import Link from "next/link";
import React from "react";

const SideBarLink = ({href, children}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href} className="group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium  text-white  hover:bg-secondary">{children}</Link>
)

export default SideBarLink
