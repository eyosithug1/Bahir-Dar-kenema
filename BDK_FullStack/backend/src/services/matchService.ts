import { Match, LeagueStanding } from '../models/types.js';
import { mockMatches, mockStandings } from './mockData.js';

let matches: Match[] = [...mockMatches];
let standings: LeagueStanding[] = [...mockStandings];

export const matchService = {
  getAllMatches: () => matches,

  getMatchById: (id: string) => matches.find((m) => m.id === id),

  getUpcomingMatches: () => matches.filter((m) => m.status === 'UPCOMING'),

  getRecentResults: () => matches.filter((m) => m.status === 'COMPLETED'),

  getStandings: () => standings,

  createMatch: (matchData: Omit<Match, 'id'>) => {
    const newMatch: Match = {
      ...matchData,
      id: `m-${Date.now()}`,
    };
    matches.unshift(newMatch);
    return newMatch;
  },

  updateMatch: (id: string, updates: Partial<Match>) => {
    const index = matches.findIndex((m) => m.id === id);
    if (index === -1) return null;
    matches[index] = { ...matches[index], ...updates };
    return matches[index];
  },
};
