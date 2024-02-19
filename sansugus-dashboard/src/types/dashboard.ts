interface DataTableProps {
    data: any,
    excludedRows?: string[],
    isLoading: boolean,
    moreDetailsDir?: string,
    onDataChanged: (newData:any)=>void
}

type TableDashboardProps = {
    handleSeasonChanged: (season:string)=>void;
    handleConfirm: ()=>void;
    season: string | undefined;
    seasonsEndPoint: string;
    tableProps: DataTableProps
}

export type {
    TableDashboardProps, DataTableProps
}