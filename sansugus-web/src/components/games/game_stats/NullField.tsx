import player from '../../../img/player.png'

const NullField = () =>{


    return (
        <>
                    <div className="attackers row">
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="midfielders row">
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="defenders row">
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="goalkeeper row">
                        <div className="player loading">
                            <div className="loading-container">
                                <div className="loading-image">
                                    <div className="loading-gradient"></div>    
                                    <img src={player}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
    )
}

export default NullField