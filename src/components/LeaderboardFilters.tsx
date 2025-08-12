import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { LeaderboardFilters as FilterType } from '@/lib/services/leaderboardService';

interface LeaderboardFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  availableCategories: string[];
}

const LeaderboardFilters: React.FC<LeaderboardFiltersProps> = ({
  filters,
  onFiltersChange,
  availableCategories
}) => {
  const difficulties = ['easy', 'medium', 'hard'] as const;

  const handleCategoryChange = (category: string) => {
    onFiltersChange({
      ...filters,
      category: category === 'all' ? undefined : category
    });
  };

  const handleDifficultyChange = (difficulty: string) => {
    onFiltersChange({
      ...filters,
      difficulty: difficulty === 'all' ? undefined : difficulty as 'easy' | 'medium' | 'hard'
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = filters.category || filters.difficulty;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <span className="font-medium text-foreground">Filter by:</span>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Category:</label>
          <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {availableCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Difficulty:</label>
          <Select value={filters.difficulty || 'all'} onValueChange={handleDifficultyChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {difficulties.map(difficulty => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <span>Active filters:</span>
          {filters.category && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {filters.category}
            </span>
          )}
          {filters.difficulty && (
            <span className="px-2 py-1 bg-primary/10 text-primary rounded">
              {filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LeaderboardFilters;