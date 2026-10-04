const formatter = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Madrid',
})

const Date: React.FC<{date:Date}> = ({date}) => {
    return <>{formatter.format(date)}</>
}

export default Date;
