import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Select, SelectItem } from "@/components/ui/select";

export default function GolfTracker() {
  const [rounds, setRounds] = useState([]);
  const [currentRound, setCurrentRound] = useState(
    Array(18).fill({ gir: false, upAndDown: false, penalty: false, score: 0, putts: 0, doubleChip: false })
  );
  const [selectedStat, setSelectedStat] = useState("score");

  const updateHole = (index, key, value = null) => {
    const updatedRound = [...currentRound];
    updatedRound[index] = {
      ...updatedRound[index],
      [key]: value !== null ? value : !updatedRound[index][key],
    };
    setCurrentRound(updatedRound);
  };

  const saveRound = () => {
    setRounds([...rounds, currentRound]);
    setCurrentRound(Array(18).fill({ gir: false, upAndDown: false, penalty: false, score: 0, putts: 0, doubleChip: false }));
  };

  const exportToCSV = () => {
    const header = "Hole,Score,Putts,GIR,Up & Down,Penalty,Double Chip\n";
    const csvRows = rounds.map((round, roundIndex) => {
      return round
        .map((hole, holeIndex) =>
          \`\${holeIndex + 1},\${hole.score},\${hole.putts},\${hole.gir ? "Yes" : "No"},\${hole.upAndDown ? "Yes" : "No"},\${hole.penalty ? "Yes" : "No"},\${hole.doubleChip ? "Yes" : "No"}\`
        )
        .join("\n");
    });
    const csvContent = header + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "golf_performance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateStats = () => {
    const totalRounds = rounds.length;
    if (totalRounds === 0) return {};

    let totalScores = [];
    rounds.forEach((round, roundIndex) => {
      let roundScore = 0;
      round.forEach(hole => {
        roundScore += hole[selectedStat];
      });
      totalScores.push({ round: roundIndex + 1, value: roundScore });
    });
    return {
      scoresTrend: totalScores,
    };
  };

  const stats = calculateStats();

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Golf Performance Tracker</h1>
      {currentRound.map((hole, index) => (
        <Card key={index} className="p-2 flex flex-col space-y-2">
          <span>Hole {index + 1}</span>
          <Input
            type="number"
            placeholder="Score"
            value={hole.score}
            onChange={(e) => updateHole(index, "score", Number(e.target.value))}
          />
          <Input
            type="number"
            placeholder="Putts"
            value={hole.putts}
            onChange={(e) => updateHole(index, "putts", Number(e.target.value))}
          />
          <Button onClick={() => updateHole(index, "gir")}>
            GIR: {hole.gir ? "✅" : "❌"}
          </Button>
          <Button onClick={() => updateHole(index, "upAndDown")}>
            Up & Down: {hole.upAndDown ? "✅" : "❌"}
          </Button>
          <Button onClick={() => updateHole(index, "penalty")}>
            Penalty: {hole.penalty ? "⚠️" : "❌"}
          </Button>
          <Button onClick={() => updateHole(index, "doubleChip")}>
            Double Chip: {hole.doubleChip ? "✅" : "❌"}
          </Button>
        </Card>
      ))}
      <Button onClick={saveRound} className="w-full mt-4">
        Save Round
      </Button>
      <Button onClick={exportToCSV} className="w-full mt-2 bg-green-500">
        Export Data to CSV
      </Button>
    </div>
  );
}