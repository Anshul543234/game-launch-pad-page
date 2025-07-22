import React, { useState, useEffect } from 'react';
import { ArrowLeft, Settings, Clock, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface QuizSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  timerEnabled: boolean;
  timerDuration: number; // in seconds
  showHints: boolean;
  autoAdvance: boolean;
  soundEnabled: boolean;
}

const defaultSettings: QuizSettings = {
  difficulty: 'medium',
  timerEnabled: true,
  timerDuration: 30,
  showHints: true,
  autoAdvance: true,
  soundEnabled: true,
};

const SettingsPage = () => {
  const [settings, setSettings] = useState<QuizSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('quizSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const updateSetting = <K extends keyof QuizSettings>(
    key: K,
    value: QuizSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('quizSettings', JSON.stringify(settings));
      setHasChanges(false);
      toast.success('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast.info('Settings reset to defaults');
  };

  const getDifficultyDescription = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Beginner-friendly questions with more time';
      case 'medium':
        return 'Standard difficulty with balanced challenge';
      case 'hard':
        return 'Advanced questions for expert players';
      default:
        return '';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/profile">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Quiz Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Customize your quiz experience to match your preferences
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Difficulty Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Difficulty Level
              </CardTitle>
              <CardDescription>
                Choose the challenge level for your quizzes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="difficulty">Current Level</Label>
                <Select
                  value={settings.difficulty}
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                    updateSetting('difficulty', value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-3 bg-muted rounded-lg">
                <Badge className={getDifficultyColor(settings.difficulty)}>
                  {settings.difficulty.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  {getDifficultyDescription(settings.difficulty)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Timer Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timer Settings
              </CardTitle>
              <CardDescription>
                Configure time limits for questions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timer-enabled">Enable Timer</Label>
                <Switch
                  id="timer-enabled"
                  checked={settings.timerEnabled}
                  onCheckedChange={(checked) => updateSetting('timerEnabled', checked)}
                />
              </div>

              {settings.timerEnabled && (
                <div className="space-y-3">
                  <Label>Timer Duration: {settings.timerDuration} seconds</Label>
                  <Slider
                    value={[settings.timerDuration]}
                    onValueChange={([value]) => updateSetting('timerDuration', value)}
                    min={10}
                    max={120}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10s (Quick)</span>
                    <span>60s (Standard)</span>
                    <span>120s (Relaxed)</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Game Experience */}
          <Card>
            <CardHeader>
              <CardTitle>Game Experience</CardTitle>
              <CardDescription>
                Customize your gameplay features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-hints">Show Hints</Label>
                  <p className="text-xs text-muted-foreground">
                    Display helpful hints for difficult questions
                  </p>
                </div>
                <Switch
                  id="show-hints"
                  checked={settings.showHints}
                  onCheckedChange={(checked) => updateSetting('showHints', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-advance">Auto Advance</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically move to next question after answering
                  </p>
                </div>
                <Switch
                  id="auto-advance"
                  checked={settings.autoAdvance}
                  onCheckedChange={(checked) => updateSetting('autoAdvance', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="sound-enabled">Sound Effects</Label>
                  <p className="text-xs text-muted-foreground">
                    Play audio feedback for answers and actions
                  </p>
                </div>
                <Switch
                  id="sound-enabled"
                  checked={settings.soundEnabled}
                  onCheckedChange={(checked) => updateSetting('soundEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Settings Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
              <CardDescription>
                Save your changes or reset to defaults
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={saveSettings} 
                className="w-full"
                disabled={!hasChanges}
              >
                Save Settings
              </Button>
              
              <Button 
                onClick={resetSettings} 
                variant="outline" 
                className="w-full"
              >
                Reset to Defaults
              </Button>

              {hasChanges && (
                <p className="text-xs text-amber-600 text-center">
                  You have unsaved changes
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SettingsPage;