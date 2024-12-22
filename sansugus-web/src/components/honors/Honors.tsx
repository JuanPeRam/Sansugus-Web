import { CardBody, CardContainer, CardItem } from "../ui/3d-card"

export const Honors = () => {

    const honors = [
        {
            name: 'Liga de Apertura Moralzarzal',
            year: '2024',
            img: '/resources/img/trophys/laliga-trophy.png'
        },
    ]
    return (
        <section className="flex flex-wrap justify-start items-center w-full gap-4">
            {honors.map((honor, index) => (
                <CardContainer className="inter-var select-none" key={index}>
                    <CardBody className="relative group/card  hover:shadow-teamOrange hover:shadow-xl bg-black w-auto sm:w-[30rem] h-auto rounded-xl p-10 border flex flex-col justify-center items-center gap-2">
                        <CardItem
                            translateZ={50}
                            className="text-2xl font-bold text-white">
                            {honor.name}
                        </CardItem>
                        <CardItem
                            as={'p'}
                            className="text-white text-xl"
                            translateZ={60}>
                            {honor.year}
                        </CardItem>
                        <CardItem
                            translateZ={100}
                        >
                            <img src={honor.img} alt="Foto del equipo" className="object-contain h-72 text-white" />
                        </CardItem>
                    </CardBody>
                </CardContainer>
            ))}
        </section>
    )
}
