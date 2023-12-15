export interface Slot {
  id: string;
  GameTemplateId: number;
  AllocatedAt: Date;
  StartedAt: Date | undefined;
  players: string[];
  totalPlayers: number;
  arrivedPlayers : number;
  maxPlayer: number;
}
export interface Player{
  id:string
  name: string,
  phone:number,
  playerCount: number,
  arrived:boolean,
  time: Date
}
