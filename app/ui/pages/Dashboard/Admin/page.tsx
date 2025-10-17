'use client';

import { SlideBar } from "../../../components/slideBar"
import { useState } from "react"
import HomePage from "../HomePage"
import DashboardPage from "../DashboardPage"
import { TasksPage } from "../TasksPage"
import ListsPage from "../ListsPage"
import SettingsPage from "../SettingsPage"

export default function Homepage() {
    const [isSelected, setIsSelected] = useState('home')

    const renderContent = () => {
        switch (isSelected) {
            case 'home':
                return <HomePage />
            case 'tareas':
                return <DashboardPage />
            case 'Tareas':
                return <TasksPage />
            case 'listas':
            case 'listas-usuarios':
            case 'listas-empresas':
            case 'listas-areas':
                return <ListsPage selectedList={isSelected} />
            case 'configuracion':
                return <SettingsPage />
            default:
                return <HomePage />
        }
    }

    return (
        <div className="flex h-screen bg-[#0A0A0A] w-screen">
            <SlideBar isSelected={isSelected} setIsSelected={setIsSelected} />
            <div className="flex-1 overflow-auto ml-6">
                {renderContent()}
            </div>
        </div>
    )
}