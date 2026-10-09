import { Player, Position } from '../models/types.js';
import { mockPlayers } from './mockData.js';

let players: Player[] = [...mockPlayers];

export const playerService = {
  getAllPlayers: (position?: Position) => {
    if (position) {
      return players.filter((p) => p.position.toLowerCase() === position.toLowerCase());
    }
    return players;
  },

  getPlayerById: (id: string) => players.find((p) => p.id === id),

  createPlayer: (playerData: Omit<Player, 'id'>) => {
    const newPlayer: Player = {
      ...playerData,
      id: `p-${Date.now()}`,
    };
    players.push(newPlayer);
    return newPlayer;
  },

  updatePlayer: (id: string, updates: Partial<Player>) => {
    const index = players.findIndex((p) => p.id === id);
    if (index === -1) return null;
    players[index] = { ...players[index], ...updates };
    return players[index];
  },

  deletePlayer: (id: string) => {
    const index = players.findIndex((p) => p.id === id);
    if (index === -1) return false;
    players.splice(index, 1);
    return true;
  },
};
