import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"

export const LeftBar = () => {
  return (
    <nav className="h-screen border-r p-2">
        <Card>
            <CardHeader>
                <CardTitle>
                    Bienvenid@
                </CardTitle>
                <CardDescription>
                    Al dashboard del Sansugus FC
                </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
            <CardFooter>
                <Button><a href="https://sansugusfc.netlify.app" target="_blank">Visitar Web</a></Button>
            </CardFooter>
        </Card>
    </nav>
  )
}
