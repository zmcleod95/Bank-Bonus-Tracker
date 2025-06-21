import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

const DateCard = ({ dates = [] }) => {
  // Sort dates by date (nearest first)
  const sortedDates = [...dates].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-primary" />
          Upcoming Dates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedDates.length === 0 ? (
          <p className="text-sm text-muted-foreground">No upcoming dates</p>
        ) : (
          <ul className="space-y-3">
            {sortedDates.map((item, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 text-xs font-medium text-gray-500">
                  {item.date ? formatDate(item.date, { month: 'short', day: 'numeric' }) : 'TBD'}
                </div>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default DateCard;

