import { Link } from 'react-router-dom';
import { Calendar, DollarSign, Percent, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';

const BonusCard = ({ bonus, onTrack }) => {
  const {
    id,
    bank_id,
    title,
    bonus_amount,
    interest_rate,
    holding_period,
    direct_deposit_required,
    direct_deposit_amount,
    expiration_date,
    link,
  } = bonus;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">
              {/* This would be replaced with actual bank data in a real implementation */}
              {`Bank ID: ${bank_id}`}
            </p>
          </div>
          <div className="text-2xl font-bold text-primary">
            {formatCurrency(bonus_amount)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{interest_rate}% APY</span>
          </div>
          
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{holding_period} Days Holding Period</span>
          </div>
          
          <div className="flex items-center text-sm">
            <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            {direct_deposit_required ? (
              <span>Direct Deposit: {formatCurrency(direct_deposit_amount)} required</span>
            ) : (
              <span>No Direct Deposit Required</span>
            )}
          </div>
          
          {expiration_date && (
            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Expires: {formatDate(expiration_date)}</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          onClick={() => onTrack && onTrack(bonus)}
        >
          Track This Bonus
        </Button>
        <Button 
          variant="default" 
          asChild
        >
          <a href={link} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BonusCard;

