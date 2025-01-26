import { branleDeNoirmoutier } from "./dances/branleDeNoirmoutier";
import { bourreInSix } from "./dances/bourreInSix";
import { chapelloise } from "./dances/chapelloise";
import { Dance } from "./dance";

export interface DanceConfig {
  id: string;
  name: string;
  createDance: (nPairs?: number) => Dance;
  defaultPairs?: number;
}

export const danceList: DanceConfig[] = [
  {
    id: "branle-de-noirmoutier",
    name: "Branle de Noirmoutier",
    createDance: (nPairs = 10) => branleDeNoirmoutier(nPairs),
    defaultPairs: 10,
  },
  {
    id: "bourree-in-six",
    name: "Bourrée in Six",
    createDance: () => bourreInSix(),
  },
  {
    id: "chapelloise",
    name: "Chapelloise",
    createDance: (nPairs = 10) => chapelloise(nPairs),
    defaultPairs: 10,
  },
];
