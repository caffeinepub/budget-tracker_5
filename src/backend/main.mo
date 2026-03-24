import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ExpenseCategory = {
    #food;
    #transport;
    #rent;
    #entertainment;
    #health;
    #others;
  };

  type ExpenseEntry = {
    id : Nat;
    category : ExpenseCategory;
    amount : Float;
    date : Text;
    description : Text;
    monthYear : Text;
  };

  type UserProfile = {
    monthlyIncome : Float;
  };

  type MonthlySummary = {
    totalSpent : Float;
    totalIncome : Float;
    savings : Float;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userExpenses = Map.empty<Principal, Map.Map<Text, Map.Map<Nat, ExpenseEntry>>>();
  var nextExpenseId = 0;

  func getUserExpensesMap(caller : Principal) : Map.Map<Text, Map.Map<Nat, ExpenseEntry>> {
    switch (userExpenses.get(caller)) {
      case (null) { Map.empty<Text, Map.Map<Nat, ExpenseEntry>>() };
      case (?expenses) { expenses };
    };
  };

  // Required profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Budget Tracker specific functions
  public shared ({ caller }) func setMonthlyIncome(income : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can set monthly income");
    };
    if (income < 0) { Runtime.trap("Income cannot be negative") };
    userProfiles.add(caller, { monthlyIncome = income });
  };

  public query ({ caller }) func getMonthlyIncome() : async ?Float {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view monthly income");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?profile) { ?profile.monthlyIncome };
    };
  };

  public shared ({ caller }) func addExpense(
    category : ExpenseCategory,
    amount : Float,
    date : Text,
    description : Text,
    monthYear : Text
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add expenses");
    };
    if (amount <= 0) { Runtime.trap("Amount must be positive") };

    let expense : ExpenseEntry = {
      id = nextExpenseId;
      category;
      amount;
      date;
      description;
      monthYear;
    };

    let expensesMap = getUserExpensesMap(caller);
    let monthExpenses = switch (expensesMap.get(monthYear)) {
      case (null) { Map.empty<Nat, ExpenseEntry>() };
      case (?expenses) { expenses };
    };

    monthExpenses.add(nextExpenseId, expense);
    expensesMap.add(monthYear, monthExpenses);
    userExpenses.add(caller, expensesMap);

    nextExpenseId += 1;
    switch (userProfiles.get(caller)) {
      case (null) {
        userProfiles.add(caller, { monthlyIncome = 0.0 });
      };
      case (_) {};
    };

    expense.id;
  };

  public query ({ caller }) func getExpensesForMonth(monthYear : Text) : async [ExpenseEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view expenses");
    };
    let expensesMap = getUserExpensesMap(caller);
    switch (expensesMap.get(monthYear)) {
      case (null) { [] };
      case (?monthExpenses) {
        let expensesArray = monthExpenses.values().toArray();
        expensesArray.sort(func(a : ExpenseEntry, b : ExpenseEntry) : Order.Order {
          Text.compare(a.date, b.date)
        });
      };
    };
  };

  public shared ({ caller }) func updateExpense(
    expenseId : Nat,
    category : ExpenseCategory,
    amount : Float,
    date : Text,
    description : Text,
    monthYear : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update expenses");
    };
    let expensesMap = getUserExpensesMap(caller);
    switch (expensesMap.get(monthYear)) {
      case (null) {
        Runtime.trap("Expense not found");
      };
      case (?monthExpenses) {
        switch (monthExpenses.get(expenseId)) {
          case (null) {
            Runtime.trap("Expense not found");
          };
          case (_) {
            let updatedExpense : ExpenseEntry = {
              id = expenseId;
              category;
              amount;
              date;
              description;
              monthYear;
            };
            monthExpenses.add(expenseId, updatedExpense);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deleteExpense(monthYear : Text, expenseId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete expenses");
    };
    let expensesMap = getUserExpensesMap(caller);
    switch (expensesMap.get(monthYear)) {
      case (null) {
        Runtime.trap("Expense not found");
      };
      case (?monthExpenses) {
        if (not monthExpenses.containsKey(expenseId)) {
          Runtime.trap("Expense not found");
        };
        monthExpenses.remove(expenseId);
      };
    };
  };

  public query ({ caller }) func getMonthlySummary(monthYear : Text) : async MonthlySummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view monthly summary");
    };
    let expensesMap = getUserExpensesMap(caller);
    let totalSpent : Float = switch (expensesMap.get(monthYear)) {
      case (null) { 0.0 };
      case (?monthExpenses) {
        var sum : Float = 0.0;
        for (exp in monthExpenses.values()) {
          sum += exp.amount;
        };
        sum;
      };
    };

    let totalIncome : Float = switch (userProfiles.get(caller)) {
      case (null) { 0.0 };
      case (?profile) { profile.monthlyIncome };
    };

    {
      totalSpent;
      totalIncome;
      savings = totalIncome - totalSpent;
    };
  };
};
