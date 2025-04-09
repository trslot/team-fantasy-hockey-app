export interface IGame {
    homeTeam: string;
    homeTeamAbbreviation: string;
    homeScore: number;
    awayTeam: string;
    awayTeamAbbreviation: string;
    awayScore: number;
    status: string;
    period?: number;
    startTime: string;
}
