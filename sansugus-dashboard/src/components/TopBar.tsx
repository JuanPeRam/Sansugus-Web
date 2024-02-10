import { ModeToggle } from "./theme/mode-toggle"

export const TopBar = () => {
  return (
    <section className="p-5 border-b flex justify-end items-center">
        <article className="">
            <ModeToggle/>
        </article>
    </section>
  )
}
