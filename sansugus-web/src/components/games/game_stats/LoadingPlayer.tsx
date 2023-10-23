const loadingShirtURL = '/resources/img/shirts/Shirt.png'

const LoadingPlayer: React.FC<{}> = ({}) => {

    return(
        <div className="player loading">
            <div className="loading-container">
                <div className="loading-image">
                    <div className="loading-gradient"></div>
                    <img src={loadingShirtURL} alt='null player image'/>
                </div>
            </div>
        </div>
    )
}

export default LoadingPlayer