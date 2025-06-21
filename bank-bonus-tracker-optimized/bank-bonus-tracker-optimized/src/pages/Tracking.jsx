import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import TrackedBonusCard from '@/components/tracking/TrackedBonusCard';
import { usePlayer } from '@/context/PlayerContext';
import useStore from '@/lib/store';

const Tracking = () => {
  const { currentPlayer, currentPlayerName } = usePlayer();
  const { 
    bonuses, 
    banks, 
    fetchBonuses, 
    fetchBanks, 
    fetchTrackedBonuses,
    getTrackedBonusesByPlayer,
    updateTrackedBonus
  } = useStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchBonuses();
    fetchBanks();
    fetchTrackedBonuses();
  }, [fetchBonuses, fetchBanks, fetchTrackedBonuses]);

  // Get tracked bonuses for current player
  const playerTrackedBonuses = getTrackedBonusesByPlayer(currentPlayer);

  // State for filters
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  // State for update status dialog
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusDate, setStatusDate] = useState('');
  const [statusNotes, setStatusNotes] = useState('');

  // Handle opening the update status dialog
  const handleOpenUpdateDialog = (trackedBonus) => {
    setSelectedBonus(trackedBonus);
    setNewStatus(trackedBonus.status);
    setStatusDate(new Date().toISOString().split('T')[0]);
    setStatusNotes('');
    setUpdateDialogOpen(true);
  };

  // Handle updating the status
  const handleUpdateStatus = () => {
    if (!selectedBonus) return;

    const updates = {
      status: newStatus,
      notes: statusNotes ? `${selectedBonus.notes ? selectedBonus.notes + '\n\n' : ''}${statusNotes}` : selectedBonus.notes
    };

    // Update specific date fields based on the new status
    switch (newStatus) {
      case 'applied':
        updates.application_date = statusDate;
        break;
      case 'account_opened':
        updates.account_open_date = statusDate;
        break;
      case 'requirements_met':
        // If direct deposit was required, mark it as complete
        if (selectedBonus.bonus?.direct_deposit_required) {
          updates.direct_deposit_complete = true;
          updates.direct_deposit_date = statusDate;
        }
        break;
      case 'bonus_received':
        updates.bonus_received_date = statusDate;
        break;
      case 'completed':
        updates.completion_date = statusDate;
        break;
      default:
        break;
    }

    updateTrackedBonus(selectedBonus.id, updates);
    setUpdateDialogOpen(false);
  };

  // Filter tracked bonuses
  const filteredBonuses = playerTrackedBonuses
    .filter(tb => {
      // Status filter
      if (statusFilter !== 'all' && tb.status !== statusFilter) {
        return false;
      }
      
      // Archived filter
      if (!showArchived && !tb.is_active) {
        return false;
      }
      
      // Search term filter
      if (searchTerm && !tb.bonus?.title?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by status (active first, then by status progression)
      const statusOrder = {
        'planned': 0,
        'applied': 1,
        'account_opened': 2,
        'requirements_met': 3,
        'bonus_received': 4,
        'completed': 5,
        'failed': 6
      };
      
      if (a.is_active !== b.is_active) {
        return a.is_active ? -1 : 1;
      }
      
      return (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">{currentPlayerName}'s Tracked Bonuses</h1>
        
        <Button asChild>
          <Link to="/bonuses" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Track New Bonus
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 md:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search bonuses..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="planned">Planned</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="account_opened">Account Opened</SelectItem>
            <SelectItem value="requirements_met">Requirements Met</SelectItem>
            <SelectItem value="bonus_received">Bonus Received</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="show-archived"
            checked={showArchived}
            onChange={(e) => setShowArchived(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label htmlFor="show-archived" className="text-sm">
            Show Archived
          </label>
        </div>
      </div>

      {filteredBonuses.length === 0 ? (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No tracked bonuses found</h2>
          <p className="text-muted-foreground mb-4">
            {searchTerm || statusFilter !== 'all' || showArchived
              ? "Try adjusting your filters or search term."
              : "Start tracking bank bonuses to see them here."}
          </p>
          <Button asChild>
            <Link to="/bonuses">Browse Bonuses</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBonuses.map(trackedBonus => (
            <TrackedBonusCard 
              key={trackedBonus.id}
              trackedBonus={trackedBonus}
              bonus={trackedBonus.bonus}
              bank={trackedBonus.bank}
              onUpdate={handleOpenUpdateDialog}
              onEdit={() => {}} // This would open an edit dialog in a real implementation
            />
          ))}
        </div>
      )}

      {/* Update Status Dialog */}
      <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Bonus Status</DialogTitle>
            <DialogDescription>
              Update the status of your tracked bonus.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div>
              <h3 className="font-medium mb-1">{selectedBonus?.bonus?.title}</h3>
              <p className="text-sm text-muted-foreground">Current Status: {selectedBonus?.status}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Select New Status</Label>
              <RadioGroup value={newStatus} onValueChange={setNewStatus}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planned" id="planned" />
                  <Label htmlFor="planned">Planned</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="applied" id="applied" />
                  <Label htmlFor="applied">Applied</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="account_opened" id="account_opened" />
                  <Label htmlFor="account_opened">Account Opened</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="requirements_met" id="requirements_met" />
                  <Label htmlFor="requirements_met">Requirements Met</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bonus_received" id="bonus_received" />
                  <Label htmlFor="bonus_received">Bonus Received</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="completed" id="completed" />
                  <Label htmlFor="completed">Completed</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="failed" id="failed" />
                  <Label htmlFor="failed">Failed</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-date">Date</Label>
              <Input
                id="status-date"
                type="date"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-notes">Notes</Label>
              <Textarea
                id="status-notes"
                placeholder="Add any notes about this status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tracking;

