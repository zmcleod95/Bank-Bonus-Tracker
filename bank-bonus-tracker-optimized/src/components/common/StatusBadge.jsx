import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        planned: "bg-blue-100 text-blue-800",
        applied: "bg-purple-100 text-purple-800",
        account_opened: "bg-indigo-100 text-indigo-800",
        requirements_met: "bg-amber-100 text-amber-800",
        bonus_received: "bg-green-100 text-green-800",
        completed: "bg-emerald-100 text-emerald-800",
        failed: "bg-red-100 text-red-800",
      },
    },
    defaultVariants: {
      variant: "planned",
    },
  }
);

const statusLabels = {
  planned: "Planned",
  applied: "Applied",
  account_opened: "Account Opened",
  requirements_met: "Requirements Met",
  bonus_received: "Bonus Received",
  completed: "Completed",
  failed: "Failed",
};

const StatusBadge = ({ status, className }) => {
  return (
    <span className={cn(statusVariants({ variant: status }), className)}>
      {statusLabels[status] || status}
    </span>
  );
};

export default StatusBadge;

