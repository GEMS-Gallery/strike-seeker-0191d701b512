import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : string } |
  { 'err' : string };
export type Streak = bigint;
export type Username = string;
export interface _SERVICE {
  'checkIn' : ActorMethod<[], Result_1>,
  'generateQRCode' : ActorMethod<[], string>,
  'getLeaderboard' : ActorMethod<[], Array<[Username, Streak]>>,
  'setUsername' : ActorMethod<[string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
