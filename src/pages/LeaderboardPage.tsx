
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Award, ChevronUp, Trophy, Medal, Crown, Users } from 'lucide-react';
import { 
  getTopUsers, 
  initializeSampleData, 
  getAvailableCategories,
  type LeaderboardEntry, 
  type LeaderboardFilters as FilterType
} from '@/lib/services/leaderboardService';
import LeaderboardFilters from '@/components/LeaderboardFilters';

const LeaderboardPage = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterType>({});
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        // Initialize sample data if needed
        initializeSampleData();
        
        // Get available categories
        const categories = getAvailableCategories();
        setAvailableCategories(categories);
        
        // Get top 10 users with current filters
        const topUsers = getTopUsers(10, filters);
        setLeaderboardData(topUsers);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();
  }, [filters]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Trophy className="h-5 w-5 text-amber-700" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getFilterDescription = () => {
    const parts = [];
    if (filters.category) parts.push(`${filters.category} category`);
    if (filters.difficulty) parts.push(`${filters.difficulty} difficulty`);
    return parts.length > 0 ? ` (${parts.join(', ')})` : '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 px-4 md:px-8 bg-gradient-to-b from-white to-purple-50">
        <div className="container mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-purple-800 mb-4">
              Global Leaderboard{getFilterDescription()}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our top quiz masters who have proven their knowledge across various categories. 
              Can you make it to the top?
            </p>
          </div>

          <LeaderboardFilters
            filters={filters}
            onFiltersChange={setFilters}
            availableCategories={availableCategories}
          />
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 bg-purple-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Award className="h-8 w-8 text-purple-700 mr-3" />
                  <h2 className="text-2xl font-bold text-purple-800">Top Players</h2>
                </div>
                <div className="text-sm text-gray-500">
                  Last updated: {formatDate(new Date().toISOString())}
                </div>
              </div>
            </div>
            
            {loading ? (
              <div className="p-8 text-center">
                <div className="text-gray-500">Loading leaderboard...</div>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-500 mb-4">
                  {Object.keys(filters).length > 0 
                    ? `No quiz results found for the selected filters${getFilterDescription()}`
                    : 'No quiz results yet!'
                  }
                </div>
                <p className="text-sm text-gray-400">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters or take a quiz in this category!'
                    : 'Be the first to take a quiz and claim the top spot!'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">
                        <div className="flex items-center justify-end">
                          Total Score <ChevronUp className="ml-1 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Avg Score</TableHead>
                      <TableHead className="text-right">Quizzes</TableHead>
                      <TableHead className="text-right">Accuracy</TableHead>
                      <TableHead>Categories</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboardData.map((player, index) => {
                      const rank = index + 1;
                      return (
                        <TableRow key={player.id} className={rank <= 3 ? "bg-purple-50" : ""}>
                          <TableCell className="font-medium">
                            <div className="flex items-center">
                              {rank <= 3 ? (
                                <div className="flex items-center">
                                  {getRankIcon(rank)}
                                  <span className="ml-2 font-bold">{rank}</span>
                                </div>
                              ) : (
                                <span className="text-gray-600">{rank}</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{player.username}</TableCell>
                          <TableCell className="text-right font-bold">{player.totalScore}</TableCell>
                          <TableCell className="text-right">{player.averageScore}%</TableCell>
                          <TableCell className="text-right">{player.totalQuizzes}</TableCell>
                          <TableCell className="text-right">{player.accuracy}%</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {player.categories.slice(0, 3).map(category => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                              {player.categories.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{player.categories.length - 3}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
