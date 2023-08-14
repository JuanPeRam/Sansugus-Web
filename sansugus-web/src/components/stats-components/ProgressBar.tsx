import '../../styles/ProgressBar.css'
import {useState} from 'react'

const ProgressBar:React.FC<{ percent: string }> = ({ percent }) => {
    const emptyElement = <></>

    const [PercentElement, setPercentElement] = useState(emptyElement)

    function showPercent(event:React.MouseEvent<HTMLDivElement, MouseEvent>){
        let x = event.pageX-25
        let y = event.pageY-40
        const newPercentElement = <div style={{
            display: "block", top: y+"px", left: x+"px", position: "absolute"
        }} className='percent-element'>{percent}%</div>
        setPercentElement(newPercentElement)
    }

    function setPercentNull(){
        setPercentElement(emptyElement)
    }
    return (
        <>
            <div className='progress-bar'>
                    <div style={{width: `${percent}%`}}
                    className='filler' onMouseMove={(event) => showPercent(event)} onMouseLeave={()=>setPercentNull()}>
                    </div>
            </div>
            {PercentElement}
        </>
    )
}

export default ProgressBar