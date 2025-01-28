import React from 'react';
import Image from "next/image";
import logo from "../../../public/images/logo_cinephoria.png";
import Link from "next/link";

const EmployeeLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <Image
                        alt="logo cinephoria"
                        src={logo}
                        width={50}
                        height={50}
                    />
                    <span className="text-xl font-bold">Cinephoria</span>
                </div>
                {/* Liens */}
                <div className="flex space-x-4">
                    <Link href="/" className="hover:underline">Retour au site</Link>
                    <Link href="/admin" className="hover:underline">Admin</Link>
                </div>
            </header>

            {/* Body */}
            <div className="flex flex-1">
                {/* Menu latéral */}
                <nav className="w-1/4 bg-gray-200 p-4 hidden md:block">
                    <ul>
                        <li><a href="/films" className="block py-2 px-4 hover:bg-gray-300">Films</a></li>
                        <li><a href="/seances" className="block py-2 px-4 hover:bg-gray-300">Séances</a></li>
                        <li><a href="/salles" className="block py-2 px-4 hover:bg-gray-300">Salles</a></li>
                        <li><a href="/avis" className="block py-2 px-4 hover:bg-gray-300">Avis Films</a></li>
                    </ul>
                </nav>

                {/* Contenu central */}
                <main className="flex-1 p-4">
                    <h1 className="text-2xl font-bold">Gestion des Films</h1>
                    <p>Contenu principal où les actions de l'employé seront affichées ici.</p>
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;