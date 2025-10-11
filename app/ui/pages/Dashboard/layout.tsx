'use client';

import { SlideBar } from "../../components/slideBar"
import { useState } from "react"
import HomePage from "./HomePage"
import DashboardPage from "./DashboardPage"
import TasksPage from "./TasksPage"
import ListsPage from "./ListsPage"
import SettingsPage from "./SettingsPage"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return(
        <div className="flex h-screen bg-[#0A0A0A]">
            {children}
        </div>
    )
}