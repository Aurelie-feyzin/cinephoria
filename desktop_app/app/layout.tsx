'use client'
import "./ui/globals.css";
import React, {useState} from "react";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";
import {UserProvider} from "@/app/context/UserContext";

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider>
                <html lang="fr">
                <body>
                {children}
                </body>
                </html>
            </UserProvider>
        </QueryClientProvider>
    );
}
