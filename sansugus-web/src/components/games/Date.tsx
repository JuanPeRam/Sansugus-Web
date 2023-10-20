const Date: React.FC<{date:Date}> = ({date}) => {
    const hour = date.getHours()
    let min:any = date.getMinutes()

    const isoDate = date.toLocaleDateString()

    if(min===0) min = '000'



    return (
        <>
            {isoDate} {hour}:{min}
        </>
    )
}

export default Date;