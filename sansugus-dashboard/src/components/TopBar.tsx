import { ModeToggle } from "./theme/mode-toggle"

export const TopBar = () => {
  return (
    <section className="p-5 border-b flex justify-between items-center">
        <section>
            Sección            
        </section>
        <section className="">
            <ModeToggle/>
        </section>
    </section>
  )
}
