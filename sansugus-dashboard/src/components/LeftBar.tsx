import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"

export const LeftBar = () => {
  return (
    <nav className="h-screen border-r max-w-[350px] w-[20vw]">
        <Card className="border-none shadow-none"> 
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
            <CardFooter className="flex flex-wrap gap-2 justify-center items-center">
                <a href="https://sansugusfc.netlify.app" target="_blank"><Button>Web Sansugus</Button></a>
                <a href="https://competiciones-moralzarzal.envinya.es/ligaf7moral/clasificacion" target="_blank"><Button variant={"secondary"}>Web Oficial</Button></a>
            </CardFooter>
        </Card>
        <Separator/>
    </nav>
  )
}
