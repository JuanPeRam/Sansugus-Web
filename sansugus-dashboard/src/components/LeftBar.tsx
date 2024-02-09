import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export const LeftBar = () => {
  return (
    <nav className="h-screen border-r p-2 max-w-[20vw]">
        <Card>
            <CardHeader className="text-center">
                <CardTitle>
                    Bienvenid@
                </CardTitle>
                <CardDescription>
                    Al dashboard del Sansugus FC 
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                <img src="./img/sansugus-logo.svg" alt="" className="h-32"/>
            </CardContent>
            <CardFooter className="flex flex-wrap gap-2">
            <a href="https://sansugusfc.netlify.app" target="_blank"><Button>Visitar Web</Button></a>
                <a href="https://competiciones-moralzarzal.envinya.es/ligaf7moral/clasificacion" target="_blank"><Button variant={"secondary"}>Ver Web de la Liga</Button></a>
            </CardFooter>
        </Card>
    </nav>
  )
}
