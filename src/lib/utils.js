import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Combine Tailwind classes and handle conflicts
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

// Calculate days remaining
export function daysRemaining(dateString) {
  if (!dateString) return null;
  const targetDate = new Date(dateString);
  const today = new Date();
  
  // Reset time to midnight for accurate day calculation
  targetDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// Calculate progress percentage
export function calculateProgress(trackedBonus) {
  const statusOrder = [
    'planned',
    'applied',
    'account_opened',
    'requirements_met',
    'bonus_received',
    'completed'
  ];
  
  const currentStatusIndex = statusOrder.indexOf(trackedBonus.status);
  if (currentStatusIndex === -1) return 0;
  
  return Math.round((currentStatusIndex / (statusOrder.length - 1)) * 100);
}

// Calculate net earnings
export function calculateNetEarnings(bonus, trackedBonus) {
  if (!bonus) return 0;
  
  // If actual earnings are recorded, use those
  if (trackedBonus && trackedBonus.actual_earnings > 0) {
    return trackedBonus.actual_earnings;
  }
  
  // Otherwise calculate based on bonus amount
  return bonus.bonus_amount;
}

// Get status display text
export function getStatusDisplay(status) {
  const statusMap = {
    'planned': 'Planned',
    'applied': 'Applied',
    'account_opened': 'Account Opened',
    'requirements_met': 'Requirements Met',
    'bonus_received': 'Bonus Received',
    'completed': 'Completed',
    'failed': 'Failed'
  };
  
  return statusMap[status] || status;
}

// Get status color
export function getStatusColor(status) {
  const statusColorMap = {
    'planned': 'gray',
    'applied': 'blue',
    'account_opened': 'indigo',
    'requirements_met': 'purple',
    'bonus_received': 'green',
    'completed': 'green',
    'failed': 'red'
  };
  
  return statusColorMap[status] || 'gray';
}


// Calculate interest earned
export function calculateInterest(principal, rate, days) {
  if (!principal || !rate || !days) return 0;
  
  // Convert annual rate to daily rate
  const dailyRate = rate / 365;
  
  // Calculate simple interest
  return principal * dailyRate * days;
}

// Calculate annualized ROI
export function calculateAnnualizedROI(bonus, deposit, days) {
  if (!bonus || !deposit || !days) return 0;
  
  // Calculate ROI as percentage
  const roi = (bonus / deposit) * 100;
  
  // Annualize the ROI
  const annualizedROI = (roi * 365) / days;
  
  return annualizedROI;
}

