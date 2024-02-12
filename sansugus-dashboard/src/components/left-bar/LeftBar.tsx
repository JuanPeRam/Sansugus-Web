import { Separator } from "../ui/separator"
import { TopCard } from "./TopCard"
import { AppRoutes } from "./AppRoutes"

export const LeftBar = () => {
  return (
    <nav className="h-screen border-r min-w-[150px] w-3/12">
        <TopCard/>
        <Separator/>
        <AppRoutes/>
    </nav>
  )
}
