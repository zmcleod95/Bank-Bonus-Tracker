import { useState } from 'react';
import { Save, Download, Upload, Trash2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Separator } from '@/components/ui/separator';
import { usePlayer } from '@/context/PlayerContext';
import useStore from '@/lib/store';

const Settings = () => {
  const { playerNames, updatePlayerName } = usePlayer();
  
  // State for player names
  const [player1Name, setPlayer1Name] = useState(playerNames[1]);
  const [player2Name, setPlayer2Name] = useState(playerNames[2]);
  
  // State for display preferences
  const [defaultView, setDefaultView] = useState('dashboard');
  const [defaultPlayer, setDefaultPlayer] = useState('1');
  const [currencyFormat, setCurrencyFormat] = useState('standard');
  const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');
  
  // Handle saving player names
  const handleSavePlayerNames = () => {
    updatePlayerName(1, player1Name);
    updatePlayerName(2, player2Name);
    
    // Show success message (in a real app)
    alert('Player names updated successfully');
  };
  
  // Handle saving display preferences
  const handleSavePreferences = () => {
    // In a real app, this would save to localStorage or a backend API
    
    // Show success message (in a real app)
    alert('Display preferences updated successfully');
  };
  
  // Handle exporting data
  const handleExportData = () => {
    // In a real app, this would export all data to a JSON file
    const store = useStore.getState();
    const data = {
      banks: store.banks,
      bonuses: store.bonuses,
      trackedBonuses: store.trackedBonuses,
      playerNames
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `bank-bonus-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  // Handle importing data
  const handleImportData = () => {
    // In a real app, this would open a file picker and import data
    alert('This feature would import data from a JSON file');
  };
  
  // Handle resetting data
  const handleResetData = () => {
    // In a real app, this would reset all data
    alert('All data has been reset');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Names */}
        <Card>
          <CardHeader>
            <CardTitle>Player Names</CardTitle>
            <CardDescription>
              Customize the names for Player 1 and Player 2
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="player1-name">Player 1 Name</Label>
              <Input
                id="player1-name"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Player 1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="player2-name">Player 2 Name</Label>
              <Input
                id="player2-name"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Player 2"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePlayerNames} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Names
            </Button>
          </CardFooter>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Display Preferences</CardTitle>
            <CardDescription>
              Customize how information is displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-view">Default View</Label>
              <Select value={defaultView} onValueChange={setDefaultView}>
                <SelectTrigger id="default-view">
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dashboard">Dashboard</SelectItem>
                  <SelectItem value="bonuses">Bonuses</SelectItem>
                  <SelectItem value="tracking">My Tracking</SelectItem>
                  <SelectItem value="comparison">Comparison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="default-player">Default Player</Label>
              <Select value={defaultPlayer} onValueChange={setDefaultPlayer}>
                <SelectTrigger id="default-player">
                  <SelectValue placeholder="Select default player" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">{playerNames[1]}</SelectItem>
                  <SelectItem value="2">{playerNames[2]}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency-format">Currency Format</Label>
              <Select value={currencyFormat} onValueChange={setCurrencyFormat}>
                <SelectTrigger id="currency-format">
                  <SelectValue placeholder="Select currency format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard ($1,234.56)</SelectItem>
                  <SelectItem value="compact">Compact ($1.2K)</SelectItem>
                  <SelectItem value="no-cents">No Cents ($1,235)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="date-format">
                  <SelectValue placeholder="Select date format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  <SelectItem value="MMM D, YYYY">MMM D, YYYY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSavePreferences} className="flex items-center">
              <Save className="mr-2 h-4 w-4" />
              Save Preferences
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>
            Export, import, or reset your data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="flex items-center"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleImportData}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Import Data
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="flex items-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Reset All Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    tracked bonuses and reset all settings.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetData}>
                    Yes, reset all data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          
          <div className="bg-muted/50 p-4 rounded-lg flex items-start gap-2">
            <Info className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Exporting your data allows you to create a backup that can be imported later.
              This is useful if you want to transfer your data to another device or if you
              want to make a backup before resetting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Accordion type="single" collapsible>
        <AccordionItem value="about">
          <AccordionTrigger>About Bank Bonus Tracker</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Version</span>
                <span className="text-sm">1.0.0</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-sm font-medium">Created</span>
                <span className="text-sm">June 2025</span>
              </div>
              
              <Separator className="my-2" />
              
              <p className="text-sm text-muted-foreground">
                Bank Bonus Tracker helps you maximize your earnings by tracking bank account
                bonuses for multiple people. Keep track of requirements, deadlines, and earnings
                all in one place.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Settings;

