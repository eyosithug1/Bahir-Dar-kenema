import { User } from '../models/types.js';
import { mockUsers } from './mockData.js';

let users: User[] = [...mockUsers];

export const authService = {
  login: (email: string, _password?: string) => {
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      // Auto-register fan user for smooth demo experience
      user = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'fan',
        membershipId: `BDK-FAN-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
      users.push(user);
    }
    const token = `bdk_token_${user.id}`;
    return { user, token };
  },

  register: (name: string, email: string, phoneNumber?: string) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      phoneNumber,
      role: 'fan',
      membershipId: `BDK-FAN-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    const token = `bdk_token_${newUser.id}`;
    return { user: newUser, token };
  },

  getProfile: (userId: string) => users.find((u) => u.id === userId),
};
