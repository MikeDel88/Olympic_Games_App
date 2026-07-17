import { Participations } from "../participation/participation.model";


export interface Olympic {
  id: number,
  country: string,
  participations: Participations
}

export type Olympics = Olympic[]
