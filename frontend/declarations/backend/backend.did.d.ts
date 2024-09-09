import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : Array<[Username, Streak]> } |
  { 'err' : string };
export type Streak = bigint;
export type Username = string;
export interface _SERVICE {
  'checkIn' : ActorMethod<[], Result>,
  'generateQRCode' : ActorMethod<[], string>,
  'getLeaderboard' : ActorMethod<[], Array<[Username, Streak]>>,
  'setUsername' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
