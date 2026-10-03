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
        <>
            <header className="page-hero">
                <div className="page-hero-inner">
                    <span className="eyebrow">Sala de trofeos</span>
                    <h1 className="page-title">Pal<em>marés</em></h1>
                    <p className="mt-4 max-w-xl text-white/60">Los títulos que han construido la historia del Sansugus FC.</p>
                </div>
            </header>
            <div className="page-container">
                <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3">
                    <div className="panel panel-accent p-5">
                        <div className="font-display text-6xl text-teamOrange">{honors.length}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Títulos</div>
                    </div>
                    <div className="panel p-5">
                        <div className="font-display text-6xl text-white">{honors[0].year}</div>
                        <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Último título</div>
                    </div>
                </div>
                <section className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
                    {honors.map((honor, index) => (
                        <CardContainer className="inter-var select-none" key={index}>
                            <CardBody className="group/card relative flex h-auto w-auto flex-col items-center justify-center gap-2 rounded-sm border border-border border-t-4 border-t-teamOrange bg-card p-10 hover:shadow-xl hover:shadow-teamOrange/20 sm:w-[30rem]">
                                <CardItem translateZ={60} as={'p'} className="font-display text-7xl text-teamOrange">
                                    {honor.year}
                                </CardItem>
                                <CardItem translateZ={50} className="text-center font-display text-3xl text-white">
                                    {honor.name}
                                </CardItem>
                                <CardItem translateZ={100}>
                                    <img src={honor.img} alt={honor.name} className="h-72 object-contain" />
                                </CardItem>
                            </CardBody>
                        </CardContainer>
                    ))}
                </section>
            </div>
        </>
    )
}
