export const Ranking = () => {

  fetch(`https://moral-api-production.up.railway.app/competitions`)
        .then(res => res.text())
            .then((rep) => {
                console.log(rep)
            })
        .catch((err)=>{
            console.error(err)
        })
        .finally(()=>{
        })
    
  return (
    <div>Ranking</div>
  )
}
