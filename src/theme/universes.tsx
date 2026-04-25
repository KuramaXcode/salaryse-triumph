import type { HouseVariant } from '../types';

export type UniversePack = {
  id: HouseVariant;
  title: string;
  subtitle: string;
  welcome: string;
  neon: string;
  neonRgb: string;
};

export const UNIVERSE_ORDER: HouseVariant[] = ['hp', 'got', 'marvel', 'sw', 'mh'];

export const UNIVERSES: Record<HouseVariant, UniversePack> = {
  hp: {
    id: 'hp',
    title: 'Harry Potter',
    subtitle: 'Hogwarts choices. Spellbound money.',
    welcome: 'Hogwarts',
    neon: '#e8c15f',
    neonRgb: '232, 193, 95',
  },
  got: {
    id: 'got',
    title: 'Game of Thrones',
    subtitle: 'Winter budgets. Throne-level stakes.',
    welcome: 'Westeros',
    neon: '#8fd3ff',
    neonRgb: '143, 211, 255',
  },
  marvel: {
    id: 'marvel',
    title: 'Marvel',
    subtitle: 'Build the suit. Fund the mission.',
    welcome: 'The Initiative',
    neon: '#ff4d4d',
    neonRgb: '255, 77, 77',
  },
  sw: {
    id: 'sw',
    title: 'Star Wars',
    subtitle: 'Balance risk. Jump to lightspeed.',
    welcome: 'The Galaxy',
    neon: '#eaff61',
    neonRgb: '234, 255, 97',
  },
  mh: {
    id: 'mh',
    title: 'Money Heist',
    subtitle: 'Plan. Pressure. Profit.',
    welcome: 'La Casa',
    neon: '#ff2965',
    neonRgb: '255, 41, 101',
  },
};

