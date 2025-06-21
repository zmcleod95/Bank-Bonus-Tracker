import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const StatCard = ({ title, value, icon: Icon, className, valueClassName }) => {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className={cn("text-2xl font-bold mt-1", valueClassName)}>{value}</h3>
          </div>
          {Icon && (
            <div className="p-2 bg-primary/10 rounded-full">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

