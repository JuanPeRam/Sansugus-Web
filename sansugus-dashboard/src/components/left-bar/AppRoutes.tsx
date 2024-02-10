import { FileBarChart, Home, Swords, Users2 } from "lucide-react";
import { ListItemLinkType } from "@/types";
import { ListItemLink } from "./ListItemLink";

const listItemLinkArray: ListItemLinkType[] = [
    {  
        icon: <Home/>,
        title: "Home",
        path: '/'
    },
    {  
        icon: <Users2/>,
        title: "Jugadores",
        path: '/players'
    },
    {  
        icon: <Swords/>,
        title: "Partidos",
        path: '/games'
    },
    {  
        icon: <FileBarChart/>,
        title: "Estadísticas",
        path: '/stats'
    },

] 

export const AppRoutes = () => {
  return (
    <section>
      <ul className="font-bold">
        {
            listItemLinkArray.map((item) => (
                <ListItemLink params={item} key={item.title}/>
            ))
        }
      </ul>
    </section>
  );
};
