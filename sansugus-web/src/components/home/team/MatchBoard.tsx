import { getShieldImage } from "@/rendering/teams_img"
import sansuguslogo from '@/img/sansugus-logo.svg'

const shield = (name: string) => name === 'Sansugus FC' ? sansuguslogo : getShieldImage(name)

export const TeamBadge: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-1 flex-col items-center gap-3 text-center">
    <div className="flex h-20 w-20 items-center justify-center md:h-24 md:w-24">
      {shield(name)
        ? <img src={shield(name)} alt={name} className="max-h-full max-w-full object-contain" />
        : <div className="font-display text-4xl text-muted-foreground">{name?.[0]}</div>}
    </div>
    <span className="font-display text-lg leading-tight text-white md:text-xl">{name}</span>
  </div>
)
