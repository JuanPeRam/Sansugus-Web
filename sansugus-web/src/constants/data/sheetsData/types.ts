import { teamData } from "@/types/competitionTypes"

type CompetitonResponse = {
      Equipos: string
      PTS: number
      J: number
      G: number
      E: number
      P: number
      GF: number
      GC: number
      DG: string
}

type MatchInfo = {
      competition: string,
      group: string,
      round: string,
      homeTeam: string,
      awayTeam: string,
      field: string,
      stadium:string,
      date: Date,
      result:string
}

const parseCompResponseToTeamData = (teamsData: Array<CompetitonResponse>)=>{
      const result:Array<teamData> = []
      teamsData.map((teamData : CompetitonResponse)=>{
            const position = teamData.Equipos.split('\n')[0]
            const name = teamData.Equipos.split('\n')[1]

            if(teamData.PTS)
            result.push({
                  position: Number(position),
                  teamName: name,
                  drawn: teamData.E,
                  gd: teamData.DG,
                  goals: teamData.GF,
                  goalsAgainst: teamData.GC,
                  lost: teamData.P,
                  points: teamData.PTS,
                  won: teamData.G,
                  played: teamData.J
            })
      })
      return result
}

const getTeamCompetition = (teamName:string, teamsData: Array<teamData>) => {
      const competition: Array<teamData> = [];

      let found = false;
      let i=0;
      while(!found && i<teamsData.length) {
            if(teamsData[i].teamName === teamName) found = true;
            else i++;
      }
      if(!found) return
      else{
            while(teamsData[i].position>1){
                  i--;
            }
            const  firstIndex = i;
            let j = firstIndex;
            do {
                  if(teamsData[j]) competition.push(teamsData[j]);
                  j++;
            } while(teamsData[j].position>teamsData[j-1].position);

            return competition;
      }
}

export type{
      CompetitonResponse,MatchInfo
}

export {parseCompResponseToTeamData,getTeamCompetition}