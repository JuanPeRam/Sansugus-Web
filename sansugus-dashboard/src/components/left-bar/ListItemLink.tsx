import { ListItemLinkType } from "@/types"
import { NavLink } from "react-router-dom"

type ListItemLinkParams = {
    params: ListItemLinkType
}

export const ListItemLink:React.FC<ListItemLinkParams> = ({params}) => {
  return (
    <li>
          <NavLink to={params.path} className={({ isActive }) => `flex justify-between p-3 hover:bg-secondary ${isActive ? 'bg-secondary' : ''}`}>
            <h3 className="select-none">{params.title}</h3>
            {params.icon}
          </NavLink>
    </li>
  )
}
