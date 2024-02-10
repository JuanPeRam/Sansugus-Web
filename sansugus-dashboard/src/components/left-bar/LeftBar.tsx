import { Separator } from "../ui/separator"
import { TopCard } from "./TopCard"
import { AppRoutes } from "./AppRoutes"

export const LeftBar = () => {
  return (
    <nav className="h-screen border-r max-w-[350px] w-[450px]">
        <TopCard/>
        <Separator/>
        <AppRoutes/>
    </nav>
  )
}
