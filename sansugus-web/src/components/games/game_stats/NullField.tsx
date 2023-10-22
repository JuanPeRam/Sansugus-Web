import LoadingPlayer from './LoadingPlayer'

const NullField = () =>{


    return (
        <>
                    <div className="attackers row">
                        <LoadingPlayer/>
                    </div>
                    <div className="midfielders row">
                        <LoadingPlayer/>
                        <LoadingPlayer/>
                    </div>
                    <div className="defenders row">
                        <LoadingPlayer/>
                        <LoadingPlayer/>
                        <LoadingPlayer/>
                    </div>
                    <div className="goalkeeper row">
                        <LoadingPlayer/>
                    </div>
                    </>
    )
}

export default NullField