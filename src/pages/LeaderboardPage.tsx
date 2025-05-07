
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Award, ChevronUp } from 'lucide-react';

const leaderboardData = [
  { rank: 1, name: 'Alex Johnson', score: 950, quizzes: 12, accuracy: 94 },
  { rank: 2, name: 'Morgan Smith', score: 920, quizzes: 15, accuracy: 91 },
  { rank: 3, name: 'Taylor Brown', score: 880, quizzes: 11, accuracy: 89 },
  { rank: 4, name: 'Jordan Lee', score: 845, quizzes: 14, accuracy: 87 },
  { rank: 5, name: 'Casey Wilson', score: 820, quizzes: 10, accuracy: 88 },
  { rank: 6, name: 'Riley Garcia', score: 790, quizzes: 12, accuracy: 85 },
  { rank: 7, name: 'Quinn Murphy', score: 760, quizzes: 9, accuracy: 86 },
  { rank: 8, name: 'Jamie Davis', score: 740, quizzes: 8, accuracy: 84 },
  { rank: 9, name: 'Avery Miller', score: 700, quizzes: 7, accuracy: 83 },
  { rank: 10, name: 'Dakota Chen', score: 680, quizzes: 8, accuracy: 81 }
];

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">Global Leaderboard</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our top quiz masters who have proven their knowledge across various categories. 
              Can you make it to the top?
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-700 mr-3" />
                  <h2 className="text-2xl font-bold text-purple-800">Top Players</h2>
                </div>
                <div className="text-sm text-gray-500">Last updated: May 7, 2025</div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-20">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">
                      <div className="flex items-center justify-end">
                        Score <ChevronUp className="ml-1 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Quizzes</TableHead>
                    <TableHead className="text-right">Accuracy</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboardData.map((player) => (
                    <TableRow key={player.rank} className={player.rank <= 3 ? "bg-purple-50" : ""}>
                      <TableCell className="font-medium">
                        {player.rank <= 3 ? (
                          <span className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-white ${
                            player.rank === 1 ? 'bg-yellow-500' : 
                            player.rank === 2 ? 'bg-gray-400' : 'bg-amber-700'
                          }`}>
                            {player.rank}
                          </span>
                        ) : player.rank}
                      </TableCell>
                      <TableCell className="font-medium">{player.name}</TableCell>
                      <TableCell className="text-right font-bold">{player.score}</TableCell>
                      <TableCell className="text-right">{player.quizzes}</TableCell>
                      <TableCell className="text-right">{player.accuracy}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
