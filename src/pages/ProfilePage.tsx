import { useEffect, useState } from 'react';
import { UserProfile, QuizAttempt } from '../lib/types/user';
import { getUserProfile } from '../lib/services/userProfileService';
import { Card } from '../components/ui/card';
import { Progress } from '../components/ui/progress';

const ProfilePage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getUserProfile('1'); // Using mock user ID
        console.log('Profile Data:', {
          totalQuizzes: data.totalQuizzesTaken,
          quizHistory: data.quizHistory.map(attempt => ({
            quizName: attempt.quizName,
            totalQuestions: attempt.totalQuestions,
            correctAnswers: attempt.correctAnswers,
            score: attempt.score
          }))
        });
        setProfile(data);
      } catch (err) {
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error || 'Profile not found'}</div>
      </div>
    );
  }

  // Sort quiz history by date, most recent first
  const sortedQuizHistory = [...profile.quizHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Calculate category-wise statistics
  const categoryStats = sortedQuizHistory.reduce((acc, attempt) => {
    if (!acc[attempt.category]) {
      acc[attempt.category] = {
        totalAttempts: 0,
        totalScore: 0,
        bestScore: 0,
        lastAttempt: null
      };
    }
    acc[attempt.category].totalAttempts++;
    acc[attempt.category].totalScore += attempt.score;
    acc[attempt.category].bestScore = Math.max(acc[attempt.category].bestScore, attempt.score);
    if (!acc[attempt.category].lastAttempt || new Date(attempt.date) > new Date(acc[attempt.category].lastAttempt.date)) {
      acc[attempt.category].lastAttempt = attempt;
    }
    return acc;
  }, {} as Record<string, { totalAttempts: number; totalScore: number; bestScore: number; lastAttempt: QuizAttempt | null }>);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
            {profile.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{profile.username}</h1>
            <p className="text-gray-600">{profile.email}</p>
            <p className="text-sm text-gray-500">Member since {new Date(profile.joinDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Personal Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Total Quizzes Taken</h3>
          <p className="text-3xl font-bold text-primary">{profile.totalQuizzesTaken}</p>
          <p className="text-sm text-gray-500 mt-1">Across {Object.keys(categoryStats).length} categories</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Score</h3>
          <div className="flex items-center space-x-2">
            <p className="text-3xl font-bold text-primary">{profile.averageScore}%</p>
            <Progress value={profile.averageScore} className="w-24" />
          </div>
          <p className="text-sm text-gray-500 mt-1">Overall performance</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Latest Quiz</h3>
          {sortedQuizHistory[0] ? (
            <>
              <p className="text-xl font-bold text-primary">{sortedQuizHistory[0].quizName}</p>
              <p className="text-sm text-gray-500 mt-1">
                Score: {sortedQuizHistory[0].score}% • {new Date(sortedQuizHistory[0].date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                {sortedQuizHistory[0].correctAnswers}/{sortedQuizHistory[0].totalQuestions} correct answers
              </p>
            </>
          ) : (
            <p className="text-gray-500">No quizzes taken yet</p>
          )}
        </Card>
      </div>

      {/* Category Performance */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Category Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <Card key={category} className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <p className="text-sm text-gray-600">
                    {stats.totalAttempts} {stats.totalAttempts === 1 ? 'attempt' : 'attempts'}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last attempt: {stats.lastAttempt ? new Date(stats.lastAttempt.date).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{stats.bestScore}%</p>
                  <p className="text-sm text-gray-500">Best Score</p>
                  <p className="text-sm text-gray-500">
                    Avg: {Math.round(stats.totalScore / stats.totalAttempts)}%
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed Quiz History */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Quiz History</h2>
        <div className="space-y-4">
          {sortedQuizHistory.map((attempt) => (
            <Card key={attempt.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="font-semibold text-lg">{attempt.quizName}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                      {attempt.category}
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-600">
                      Date: {new Date(attempt.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Time taken: {Math.floor(attempt.timeTaken / 60)} minutes {attempt.timeTaken % 60} seconds
                    </p>
                    <p className="text-sm text-gray-600">
                      Questions: {attempt.correctAnswers}/{attempt.totalQuestions} correct
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-bold text-primary">{attempt.score}%</div>
                  <Progress 
                    value={attempt.score} 
                    className={`w-24 mt-2 ${
                      attempt.score >= 80 ? "bg-green-500" : 
                      attempt.score >= 60 ? "bg-yellow-500" : 
                      "bg-red-500"
                    }`}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 