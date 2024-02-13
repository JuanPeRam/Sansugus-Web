import { ReactElement } from "react"


type ListItemLinkType = {
    path: string,
    title: string,
    icon: ReactElement
}

type EndPointFunction = (param:string)=>string

export type {
    ListItemLinkType,EndPointFunction
}