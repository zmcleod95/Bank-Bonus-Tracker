import { Calendar, DollarSign, FileEdit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import StatusBadge from '@/components/common/StatusBadge';
import ProgressBar from '@/components/common/ProgressBar';
import { formatCurrency, formatDate } from '@/lib/utils';

// Helper function to calculate progress percentage based on status
const getProgressPercentage = (status) => {
  const statusValues = {
    'planned': 0,
    'applied': 20,
    'account_opened': 40,
    'requirements_met': 80,
    'bonus_received': 90,
    'completed': 100,
    'failed': 0
  };
  
  return statusValues[status] || 0;
};

// Helper function to determine the next step based on status
const getNextStep = (trackedBonus, bonus) => {
  switch (trackedBonus.status) {
    case 'planned':
      return 'Apply for account';
    case 'applied':
      return 'Wait for account opening';
    case 'account_opened':
      return bonus?.direct_deposit_required 
        ? 'Complete direct deposit' 
        : 'Complete requirements';
    case 'requirements_met':
      return 'Wait for bonus';
    case 'bonus_received':
      return 'Wait for holding period to end';
    case 'completed':
      return 'Bonus completed';
    case 'failed':
      return 'Bonus failed';
    default:
      return 'Unknown status';
  }
};

const TrackedBonusCard = ({ trackedBonus, bonus, bank, onUpdate, onEdit }) => {
  const {
    id,
    status,
    application_date,
    account_open_date,
    direct_deposit_complete,
    bonus_received_date,
    completion_date,
    notes
  } = trackedBonus;

  const progressPercentage = getProgressPercentage(status);
  const nextStep = getNextStep(trackedBonus, bonus);
  
  // Calculate due date (this would be more sophisticated in a real app)
  let dueDate = null;
  if (status === 'account_opened' && bonus?.direct_deposit_required) {
    // Assuming direct deposit should be completed within 30 days of account opening
    const accountOpenDate = new Date(account_open_date);
    dueDate = new Date(accountOpenDate);
    dueDate.setDate(accountOpenDate.getDate() + 30);
  } else if (status === 'requirements_met') {
    // Assuming bonus should be received within 60 days of meeting requirements
    const today = new Date();
    dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 60);
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{bonus?.title || 'Unknown Bonus'}</h3>
            <p className="text-sm text-muted-foreground">
              {bank?.name || `Bank ID: ${bonus?.bank_id || 'Unknown'}`}
            </p>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-4">
          <ProgressBar value={progressPercentage} />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Progress:</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-start">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${status === 'planned' || status === 'applied' || status === 'account_opened' || status === 'requirements_met' || status === 'bonus_received' || status === 'completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  ✓
                </span>
                <div>
                  <p className="font-medium">Applied</p>
                  {application_date && <p className="text-xs text-gray-500">{formatDate(application_date)}</p>}
                </div>
              </div>
              
              <div className="flex items-start">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${status === 'account_opened' || status === 'requirements_met' || status === 'bonus_received' || status === 'completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  ✓
                </span>
                <div>
                  <p className="font-medium">Account Opened</p>
                  {account_open_date && <p className="text-xs text-gray-500">{formatDate(account_open_date)}</p>}
                </div>
              </div>
              
              {bonus?.direct_deposit_required && (
                <div className="flex items-start">
                  <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${direct_deposit_complete ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                    {direct_deposit_complete ? '✓' : ''}
                  </span>
                  <p className="font-medium">Direct Deposit Complete</p>
                </div>
              )}
              
              <div className="flex items-start">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${status === 'bonus_received' || status === 'completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {status === 'bonus_received' || status === 'completed' ? '✓' : ''}
                </span>
                <div>
                  <p className="font-medium">Bonus Received</p>
                  {bonus_received_date && <p className="text-xs text-gray-500">{formatDate(bonus_received_date)}</p>}
                </div>
              </div>
              
              <div className="flex items-start">
                <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full mr-2 text-xs ${status === 'completed' ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                  {status === 'completed' ? '✓' : ''}
                </span>
                <div>
                  <p className="font-medium">Holding Period Complete</p>
                  {completion_date && <p className="text-xs text-gray-500">{formatDate(completion_date)}</p>}
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Next Step:</h4>
            <p className="text-sm">{nextStep}</p>
            {dueDate && (
              <div className="flex items-center text-sm">
                <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>Due: {formatDate(dueDate)}</span>
              </div>
            )}
          </div>
          
          {notes && (
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Notes:</h4>
              <p className="text-sm text-gray-600">{notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={() => onUpdate && onUpdate(trackedBonus)}
          className="flex items-center"
        >
          <DollarSign className="h-4 w-4 mr-1" />
          Update Status
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => onEdit && onEdit(trackedBonus)}
          className="flex items-center"
        >
          <FileEdit className="h-4 w-4 mr-1" />
          Edit Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TrackedBonusCard;

