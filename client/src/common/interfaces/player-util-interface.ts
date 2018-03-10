import { ITrack } from "./track-interface";

export interface IReturn {
  success: boolean;
  track: ITrack;
  repeat?: boolean;
}
