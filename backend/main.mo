import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import Time "mo:base/Time";
import Text "mo:base/Text";
import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import Result "mo:base/Result";
import Principal "mo:base/Principal";
import Option "mo:base/Option";

actor {
  type UserId = Principal;
  type Username = Text;
  type Streak = Nat;
  type CheckInTime = Time.Time;

  type UserProfile = {
    username: ?Username;
    streak: Streak;
    lastCheckIn: ?CheckInTime;
  };

  stable var userProfiles : [(UserId, UserProfile)] = [];
  var userProfilesMap = HashMap.HashMap<UserId, UserProfile>(0, Principal.equal, Principal.hash);

  stable var checkIns : [(UserId, CheckInTime)] = [];
  var checkInsMap = HashMap.HashMap<UserId, CheckInTime>(0, Principal.equal, Principal.hash);

  var currentQRCode : Text = "";
  var lastQRCodeUpdate : Time.Time = 0;

  public shared(msg) func checkIn() : async Result.Result<Text, Text> {
    let caller = msg.caller;
    let now = Time.now();

    switch (userProfilesMap.get(caller)) {
      case (null) {
        let newProfile : UserProfile = {
          username = null;
          streak = 1;
          lastCheckIn = ?now;
        };
        userProfilesMap.put(caller, newProfile);
      };
      case (?profile) {
        let updatedProfile = updateStreak(profile, now);
        userProfilesMap.put(caller, updatedProfile);
      };
    };

    checkInsMap.put(caller, now);
    #ok("Check-in successful")
  };

  func updateStreak(profile: UserProfile, now: Time.Time) : UserProfile {
    switch (profile.lastCheckIn) {
      case (null) { { profile with streak = 1; lastCheckIn = ?now } };
      case (?lastCheckIn) {
        let daysSinceLastCheckIn = (now - lastCheckIn) / (24 * 60 * 60 * 1000000000);
        if (daysSinceLastCheckIn == 0) {
          profile
        } else if (daysSinceLastCheckIn == 1 or (daysSinceLastCheckIn == 3 and isWeekend(lastCheckIn))) {
          { profile with streak = profile.streak + 1; lastCheckIn = ?now }
        } else {
          { profile with streak = 1; lastCheckIn = ?now }
        }
      };
    }
  };

  func isWeekend(time: Time.Time) : Bool {
    let dayOfWeek = (time / (24 * 60 * 60 * 1000000000) + 4) % 7;
    dayOfWeek == 5 or dayOfWeek == 6
  };

  public query func getLeaderboard() : async [(Username, Streak)] {
    let leaderboard = Iter.toArray(userProfilesMap.vals());
    let sortedLeaderboard = Array.sort(leaderboard, func(a: UserProfile, b: UserProfile) : { #less; #equal; #greater } {
      if (a.streak > b.streak) { #less }
      else if (a.streak < b.streak) { #greater }
      else { #equal }
    });
    Array.map<UserProfile, (Username, Streak)>(Array.take(sortedLeaderboard, 20), func (profile: UserProfile) : (Username, Streak) {
      (Option.get(profile.username, "Anonymous"), profile.streak)
    })
  };

  public shared(msg) func setUsername(username: Text) : async Result.Result<(), Text> {
    let caller = msg.caller;
    switch (userProfilesMap.get(caller)) {
      case (null) { #err("User not found") };
      case (?profile) {
        let updatedProfile = { profile with username = ?username };
        userProfilesMap.put(caller, updatedProfile);
        #ok()
      };
    }
  };

  public query func generateQRCode() : async Text {
    let now = Time.now();
    if (now - lastQRCodeUpdate > 10_000_000_000) {
      currentQRCode := Text.concat("DFINITY-", Nat.toText(Int.abs(now)));
      lastQRCodeUpdate := now;
    };
    currentQRCode
  };

  system func preupgrade() {
    userProfiles := Iter.toArray(userProfilesMap.entries());
    checkIns := Iter.toArray(checkInsMap.entries());
  };

  system func postupgrade() {
    userProfilesMap := HashMap.fromIter<UserId, UserProfile>(userProfiles.vals(), 0, Principal.equal, Principal.hash);
    checkInsMap := HashMap.fromIter<UserId, CheckInTime>(checkIns.vals(), 0, Principal.equal, Principal.hash);
  };
}
