import { TeamCrest } from "@/components/TeamCrest"

export const TeamBadge: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex flex-1 flex-col items-center gap-3 text-center">
    <TeamCrest name={name} className="h-16 w-16 md:h-24 md:w-24" />
    <span className="font-display text-base leading-tight text-white md:text-xl">{name}</span>
  </div>
)
