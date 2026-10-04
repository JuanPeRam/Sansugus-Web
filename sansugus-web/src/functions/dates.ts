const longDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Madrid',
})

export function dateToString(date:Date){
    return longDate.format(date)
}
