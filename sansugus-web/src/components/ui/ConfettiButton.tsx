// Import Types
// Import External Packages
import { useState } from 'react';
import Confetti from '@/components/ui/Confetti';
// Import Functions & Actions & Hooks & State
// Import Data
// Import Assets & Icons

type Props = {
    text:string
}

export const ConfettiButton : React.FC<Props> = ({text})=> {
	const [isConfettiActive, setIsConfettiActive] = useState(false);
    const playApplauses = ()=>{
        var audio = new Audio("src/assets/sounds/effects/Aplausos.mp3")
        audio.play()
    }
	return (
		<>
            <h3 
            className='hover:cursor-pointer hover:bg-white/5 p-2 rounded-xl text-2xl'
            onClick={()=>{
                setTimeout(() => {
                    setIsConfettiActive(true);
                    playApplauses()
                }, 200);

                setTimeout(() => {
                    setIsConfettiActive(false);
                }, 4000);
            }}>
                {text}
            </h3>
			<Confetti isActive={isConfettiActive} duration={3000} />
		</>
	);
}