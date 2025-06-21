import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Percent, 
  Clock, 
  CheckCircle, 
  XCircle,
  Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import useStore from '@/lib/store';
import { formatCurrency, formatDate, calculateInterest, calculateAnnualizedROI } from '@/lib/utils';

const BonusDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBonusById, addTrackedBonus } = useStore();
  
  // Get bonus details
  const bonus = getBonusById(parseInt(id));
  
  // If bonus not found, redirect to catalog
  useEffect(() => {
    if (!bonus && id) {
      navigate('/bonuses');
    }
  }, [bonus, id, navigate]);
  
  // Calculator state
  const [calculatorValues, setCalculatorValues] = useState({
    depositAmount: 1000,
    holdingMonths: bonus ? Math.ceil(bonus.holding_period / 30) : 3,
  });
  
  // Calculate earnings
  const bonusAmount = bonus ? bonus.bonus_amount : 0;
  const interestRate = bonus ? bonus.interest_rate : 0;
  const holdingDays = calculatorValues.holdingMonths * 30;
  
  const interestEarned = calculateInterest(
    calculatorValues.depositAmount,
    interestRate,
    holdingDays
  );
  
  const totalEarnings = bonusAmount + interestEarned;
  
  const annualizedROI = calculateAnnualizedROI(
    totalEarnings,
    calculatorValues.depositAmount,
    holdingDays
  );
  
  // Handle tracking the bonus
  const handleTrackBonus = () => {
    if (!bonus) return;
    
    // In a real app, this would open a modal to collect additional information
    addTrackedBonus({
      player_id: 1, // Default to Player 1
      bonus_id: bonus.id,
      status: 'planned',
      application_date: new Date().toISOString().split('T')[0],
      notes: `Started tracking ${bonus.title}`,
    });
    
    // Show a success message (in a real app)
    alert(`Started tracking ${bonus.title}`);
    
    // Navigate to tracking page
    navigate('/tracking');
  };
  
  if (!bonus) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/bonuses">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{bonus.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Bonus Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Bonus Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Bonus Amount</p>
                  <p className="text-xl font-bold text-primary">{formatCurrency(bonus.bonus_amount)}</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Interest Rate</p>
                  <p className="text-xl font-bold">{bonus.interest_rate}% APY</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Holding Period</p>
                  <p className="text-xl font-bold">{bonus.holding_period} Days</p>
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Expiration Date</p>
                  <p className="text-xl font-bold">{bonus.expiration_date ? formatDate(bonus.expiration_date) : 'None'}</p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {bonus.direct_deposit_required ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Direct Deposit Required</p>
                    {bonus.direct_deposit_required && (
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(bonus.direct_deposit_amount)} {bonus.direct_deposit_frequency}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {bonus.min_deposit > 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Minimum Deposit Required</p>
                    {bonus.min_deposit > 0 && (
                      <p className="text-sm text-muted-foreground">
                        {formatCurrency(bonus.min_deposit)}
                      </p>
                    )}
                  </div>
                </div>
                
                {bonus.additional_requirements && (
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Additional Requirements</p>
                      <p className="text-sm text-muted-foreground">
                        {bonus.additional_requirements}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Earnings Calculator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Earnings Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Initial Deposit</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        className="pl-8"
                        value={calculatorValues.depositAmount}
                        onChange={(e) => setCalculatorValues({
                          ...calculatorValues,
                          depositAmount: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Holding Period (Months)</label>
                    <Input
                      type="number"
                      value={calculatorValues.holdingMonths}
                      onChange={(e) => setCalculatorValues({
                        ...calculatorValues,
                        holdingMonths: parseInt(e.target.value) || 0
                      })}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-medium">Results</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Bonus Amount:</span>
                      <span className="font-medium">{formatCurrency(bonusAmount)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Interest Earned:</span>
                      <span className="font-medium">{formatCurrency(interestEarned)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Earnings:</span>
                      <span className="font-bold text-primary">{formatCurrency(totalEarnings)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm">Annualized ROI:</span>
                      <span className="font-medium">{annualizedROI.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms and Conditions */}
          <Accordion type="single" collapsible>
            <AccordionItem value="terms">
              <AccordionTrigger>Terms and Conditions</AccordionTrigger>
              <AccordionContent>
                <div className="text-sm text-muted-foreground space-y-2">
                  {bonus.terms_conditions ? (
                    <p>{bonus.terms_conditions}</p>
                  ) : (
                    <p>Please refer to the bank's website for full terms and conditions.</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="space-y-6">
          {/* Bank Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium">Bank Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4 bg-muted rounded-lg">
                  {/* This would be replaced with actual bank logo in a real implementation */}
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">
                      {bonus.bank?.name?.charAt(0) || 'B'}
                    </span>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-medium">{bonus.bank?.name || `Bank ID: ${bonus.bank_id}`}</h3>
                  {bonus.bank?.website && (
                    <a 
                      href={bonus.bank.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Visit Website
                    </a>
                  )}
                </div>
                
                {bonus.bank?.description && (
                  <p className="text-sm text-muted-foreground">
                    {bonus.bank.description}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={handleTrackBonus}
            >
              Track This Bonus
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full"
              asChild
            >
              <a href={bonus.link} target="_blank" rel="noopener noreferrer">
                Apply Now
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusDetail;

