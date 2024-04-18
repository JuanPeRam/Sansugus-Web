const days = ['domingo','lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const months = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

export function setNewDate(date:string|any):Date|undefined{
    if(typeof(date)!=='string' || date==='') return
    const dateValues = date.split('-')
    const year = dateValues[0]
    const month = dateValues[1]
    const dayMins = dateValues[2].split(' ')
    const day = dayMins[0]
    const hourmins = dayMins[1].split(':')
    const hour = hourmins[0]
    const min = hourmins[1]
    const newDate:Date = new Date(parseInt(year),parseInt(month)-1,parseInt(day), parseInt(hour), parseInt(min))
    return newDate 
}

export function dateToString(date:Date){
    
    return days[date.getDay()]+", "+date.getDate()+" de "+months[date.getMonth()]+" de "+date.getFullYear()
}