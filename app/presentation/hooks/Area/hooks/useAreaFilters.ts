import { useState } from "react"
import { Area } from "./useAreaActions"

export const useAreaFilters = (areas: Area[]) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [filterEstado, setFilterEstado] = useState<string>("all")

    const filteredAreas = areas.filter(area =>
        area.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).filter(area =>
        filterEstado === "all" || area.state === filterEstado
    )

    return {
        searchQuery,
        setSearchQuery,
        filterEstado,
        setFilterEstado,
        filteredAreas
    }
}