import { useState } from "react";

export default function BettingControls({ onStart }) {
  const [bets, setBets] = useState([
    { amount: "50.00", cashOut: "1.01" },
    { amount: "50.00", cashOut: "1.01" },
  ]);

  const amountOptions = ["50.00", "1000.00", "5000.00", "10000.00"];

  const handleAmountClick = (index, value) => {
    const updated = [...bets];
    updated[index].amount = value;
    setBets(updated);
  };

  const handleMultiplier = (index, type) => {
    const updated = [...bets];
    const currentAmount = parseFloat(updated[index].amount);
    updated[index].amount =
      type === "half"
        ? (currentAmount / 2).toFixed(2)
        : (currentAmount * 2).toFixed(2);
    setBets(updated);
  };

  const handleMax = (index) => {
    const updated = [...bets];
    updated[index].amount = "10000.00";
    setBets(updated);
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...bets];
    updated[index][field] = value;
    setBets(updated);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {bets.map((bet, i) => (
        <div key={i} className="bg-[#1E1E1E] p-5 rounded-xl text-white shadow-lg">
          <div className="flex justify-between text-sm font-medium mb-3">
            <span>Bet {i + 1}</span>
            <span>Auto Cash Out</span>
          </div>

          <div className="flex justify-between items-center mb-4 gap-2">
            <input
              type="text"
              value={bet.cashOut}
              onChange={(e) => handleInputChange(i, "cashOut", e.target.value)}
              className="w-1/3 text-center rounded-md bg-black text-white px-2 py-1 outline-none border border-gray-700 focus:border-green-500"
            />
            <input
              type="text"
              value={bet.amount}
              onChange={(e) => handleInputChange(i, "amount", e.target.value)}
              className="w-2/3 text-center rounded-md bg-black text-white px-2 py-1 outline-none border border-gray-700 focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-semibold">
            {amountOptions.map((value) => (
              <button
                key={value}
                className="bg-black hover:bg-gray-800 px-2 py-1 rounded transition-colors border border-gray-600"
                onClick={() => handleAmountClick(i, value)}
              >
                {value}
              </button>
            ))}
            <button
              className="bg-black hover:bg-gray-800 px-2 py-1 rounded transition-colors border border-gray-600"
              onClick={() => handleMultiplier(i, "half")}
            >
              ½
            </button>
            <button
              className="bg-black hover:bg-gray-800 px-2 py-1 rounded transition-colors border border-gray-600"
              onClick={() => handleMultiplier(i, "double")}
            >
              x2
            </button>
            <button
              className="bg-black hover:bg-gray-800 px-2 py-1 rounded col-span-3 border border-gray-600 transition-colors"
              onClick={() => handleMax(i)}
            >
              Max
            </button>
          </div>

          <button
            onClick={onStart}
            className="bg-green-500 hover:bg-green-600 text-white font-bold w-full py-2 rounded-md shadow-md transition-all"
          >
            BET {bet.amount} INR
          </button>
        </div>
      ))}
    </div>
  );
}
