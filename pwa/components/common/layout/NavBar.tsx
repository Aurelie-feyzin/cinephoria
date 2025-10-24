'use client';

import React, {useState} from "react";
import Image from "next/image";
import logo from "../../../public/images/logo_cinephoria.png";
import Link from "next/link";
import NavBarLink from "./../NavBarLink";
import AlertError from "../alert/AlertError";
import {useUser} from "../../../context/UserContext";
import LogoutIcon from "../Icon/LogoutIcon";
import EditIcon from "../Icon/EditIcon";

const NavBar = () => {
    const [navbar, setNavbar] = useState(false);
    const {user, error, logout} = useUser();
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-black p-4">
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex lg:px-8">
                <div>
                    <div className="flex items-center justify-between py-3 md:py-5 md:block">
                        <a href={'/'} aria-label='Accueil'>
                            <Image
                                alt="logo cinephoria"
                                src={logo}
                                width={50}
                                height={50}
                            />
                        </a>
                        <div className="md:hidden">
                            <button
                                className="p-2 text-gray-700 rounded-md outline-none focus:border-gray-400 focus:border"
                                onClick={() => setNavbar(!navbar)}
                                aria-label='bouton navbar'
                            >
                                {navbar ? (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-6 h-6 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
                <div>
                    <div
                        className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0 ${
                            navbar ? "block" : "hidden"
                        }`}
                    >
                        <div
                            className="flex flex-col md:items-center justify-center space-y-0 space-x-0 md:flex md:flex-row md:space-x-6">
                            <NavBarLink href={'/'}>Accueil</NavBarLink>
                            <NavBarLink href={'/reservation'}>Réserver</NavBarLink>
                            <NavBarLink href={'/movies'}>Les films</NavBarLink>
                            <NavBarLink href={'/contact'}>Nous contacter</NavBarLink>
                            <div className="hidden md:inline-block">
                                <AlertError
                                    visible={!!error}
                                    message="Erreur pendant la récupération du profil."
                                />
                            </div>

                        </div>
                        <div className="mt-3 space-y-2 md:hidden">
                            {!user ? (
                                <Link href="/signIn"
                                      className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary">
                                    Se connecter
                                </Link>
                            ) : (
                                <div className="flex items-center">
                                    <p className="px-4 py-2 rounded-md shadow text-white hover:bg-secondary">
                                        {user?.firstName}
                                    </p>
                                    <NavBarLink href={'/orders'}>Commandes</NavBarLink>

                                    <button
                                        onClick={logout}
                                        className="text-white hover:bg-secondary transition duration-200 p-2 rounded"
                                    >
                                        <LogoutIcon/>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <AlertError
                            visible={!!error}
                            message="Erreur pendant la récupération du profil."
                        />
                    </div>
                </div>
                <div className="hidden space-x-2 md:inline-block">
                    {!user ? (
                        <Link href="/signIn"
                              className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary">
                            Se connecter
                        </Link>
                    ) : (
                        <div className="flex items-center">
                            {user?.role &&
                                <Link href="/intranet"
                                      className="px-4 py-2 rounded-md shadow text-white bg-primary hover:bg-secondary">
                                    Intranet
                                </Link>
                            }
                            <div className="relative">
                                <p
                                    className="px-4 py-2 rounded-md shadow text-white hover:bg-secondary cursor-pointer flex items-center"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                >
                                    {user?.firstName}
                                    <span className="ml-2">
            {/* Icône de menu déroulant */}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
        </span>
                                </p>
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                                        <ul>
                                            <li>
                                                <button type="button" disabled  className="block px-4 py-2 disabled:bg-gray-700 rounded-t-md w-full">
                                                    Profil
                                                </button>
                                            </li>
                                            <li>
                                                <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                                                    Commandes
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logout}
                                                    className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-200 rounded-b-md w-full justify-start"
                                                >
                                                    <LogoutIcon />
                                                    Se déconnecter
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;
