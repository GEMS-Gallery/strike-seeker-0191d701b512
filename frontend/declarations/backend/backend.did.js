export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Username = IDL.Text;
  const Streak = IDL.Nat;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'checkIn' : IDL.Func([], [Result_1], []),
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
