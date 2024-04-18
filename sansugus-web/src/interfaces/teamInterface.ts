import { Game } from "@/types/games"

interface TeamProps {
    error: String,
    loading: boolean,
    result: Game | undefined
}

export type {
    TeamProps
}