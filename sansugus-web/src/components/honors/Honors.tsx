import { CardBody, CardContainer } from "../ui/3d-card"

export const Honors = () => {

    const honors = [
        {
            name: 'Liga de Apertura Moralzarzal',
            year: '2024',
        },
    ]
    return (
        <section className="flex flex-wrap justify-start items-center w-full gap-4">
            {honors.map((honor, index) => (
                <CardContainer className="inter-var select-none" key={index}>
                    <CardBody className="relative group/card  hover:shadow-teamOrange hover:shadow-xl bg-black w-auto sm:w-[30rem] h-auto rounded-xl p-10 border flex flex-col justify-center items-center gap-2">
                        <h1 className="text-2xl font-bold">{honor.name}</h1>
                        <p>{honor.year}</p>
                        <img src={'src/assets/photo/victoria.jpg'} alt="Foto del equipo" className="object-contain h-72 aspect-square text-white" />
                    </CardBody>
                </CardContainer>
            ))}
        </section>
    )
}
