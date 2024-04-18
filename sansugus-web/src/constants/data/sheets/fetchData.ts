import { sheetResponseToObjects2 } from "@/functions/sheets"


async function fetchSheetsData (url:string){
    const result = await fetch(url)
        .then((res)=>res.text())
            .then((data)=>{
                const result = sheetResponseToObjects2(data);
                return result
            })
        .catch(err=>{
            return err
        })
    return result
}

export{ fetchSheetsData}