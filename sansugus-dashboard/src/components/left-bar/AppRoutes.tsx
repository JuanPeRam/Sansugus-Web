import { FileBarChart, Home, Swords, Users2 } from "lucide-react"
import { Separator } from "../ui/separator"
import { Link } from "react-router-dom"

export const AppRoutes = () => {
  return (
    <section>
            <ul className="font-bold">
                <li>
                    <Link to={'/'} className="flex justify-between p-3 hover:bg-secondary">
                        <h3 className="select-none">Home</h3>
                        <Home/>
                    </Link>
                </li>
                <Separator/>
                <li>
                    <Link to={'/players'} className="flex justify-between p-3 hover:bg-secondary">
                        <h3 className="select-none">Jugadores</h3>
                        <Users2/>
                    </Link>
                </li>
                <li>
                    <Link to={'/games'} className="flex justify-between p-3 hover:bg-secondary">
                        <h3 className="select-none">Partidos</h3>
                        <Swords/>
                    </Link>
                </li>
                <li className="flex justify-between p-3 hover:bg-secondary">
                    <h3 className="select-none">Estadísticas</h3>
                    <FileBarChart/>
                </li>
            </ul>
        </section>
  )
}
