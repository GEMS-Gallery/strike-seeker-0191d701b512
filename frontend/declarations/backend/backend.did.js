export const idlFactory = ({ IDL }) => {
  const Username = IDL.Text;
  const Streak = IDL.Nat;
  const Result = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(Username, Streak)),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'checkIn' : IDL.Func([], [Result], []),
    'generateQRCode' : IDL.Func([], [IDL.Text], ['query']),
    'getLeaderboard' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(Username, Streak))],
        ['query'],
      ),
    'setUsername' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
