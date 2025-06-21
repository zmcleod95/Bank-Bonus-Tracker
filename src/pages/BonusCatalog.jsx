import { useEffect, useState } from 'react';
import { Search, Filter, SortDesc } from 'lucide-react';
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
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import BonusCard from '@/components/bonuses/BonusCard';
import useStore from '@/lib/store';
import { formatCurrency } from '@/lib/utils';

const BonusCatalog = () => {
  const { bonuses, banks, fetchBonuses, fetchBanks, addTrackedBonus } = useStore();
  
  // Fetch data on component mount
  useEffect(() => {
    fetchBonuses();
    fetchBanks();
  }, [fetchBonuses, fetchBanks]);

  // State for filters and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    bankId: 'all',
    minAmount: '',
    maxAmount: '',
    directDeposit: 'all',
  });
  const [sortBy, setSortBy] = useState('bonus_amount');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Handle tracking a bonus
  const handleTrackBonus = (bonus) => {
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
  };

  // Filter and sort bonuses
  const filteredBonuses = bonuses
    .filter(bonus => {
      // Search term filter
      if (searchTerm && !bonus.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Bank filter
      if (filters.bankId !== 'all' && bonus.bank_id !== parseInt(filters.bankId)) {
        return false;
      }
      
      // Min amount filter
      if (filters.minAmount && bonus.bonus_amount < parseFloat(filters.minAmount)) {
        return false;
      }
      
      // Max amount filter
      if (filters.maxAmount && bonus.bonus_amount > parseFloat(filters.maxAmount)) {
        return false;
      }
      
      // Direct deposit filter
      if (filters.directDeposit === 'required' && !bonus.direct_deposit_required) {
        return false;
      }
      if (filters.directDeposit === 'not_required' && bonus.direct_deposit_required) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (a[sortBy] < b[sortBy]) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (a[sortBy] > b[sortBy]) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Bank Bonus Catalog</h1>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bonuses..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filters - Desktop */}
        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Filters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank</label>
              <Select 
                value={filters.bankId} 
                onValueChange={(value) => setFilters({...filters, bankId: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Banks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Banks</SelectItem>
                  {banks.map(bank => (
                    <SelectItem key={bank.id} value={bank.id.toString()}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Bonus Amount</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={filters.minAmount}
                  onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                />
                <span>to</span>
                <Input
                  type="number"
                  placeholder="Max"
                  value={filters.maxAmount}
                  onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Direct Deposit</label>
              <Select 
                value={filters.directDeposit} 
                onValueChange={(value) => setFilters({...filters, directDeposit: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Any</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="not_required">Not Required</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort By</label>
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Bonus Amount" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus_amount">Bonus Amount</SelectItem>
                  <SelectItem value="interest_rate">Interest Rate</SelectItem>
                  <SelectItem value="holding_period">Holding Period</SelectItem>
                  <SelectItem value="expiration_date">Expiration Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort Order</label>
              <Select 
                value={sortOrder} 
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Descending" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Highest to Lowest</SelectItem>
                  <SelectItem value="asc">Lowest to Highest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setFilters({
                bankId: 'all',
                minAmount: '',
                maxAmount: '',
                directDeposit: 'all',
              })}
            >
              Reset Filters
            </Button>
          </CardContent>
        </Card>

        {/* Filters - Mobile */}
        {showFilters && (
          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters">
                <AccordionTrigger>Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bank</label>
                      <Select 
                        value={filters.bankId} 
                        onValueChange={(value) => setFilters({...filters, bankId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="All Banks" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Banks</SelectItem>
                          {banks.map(bank => (
                            <SelectItem key={bank.id} value={bank.id.toString()}>
                              {bank.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Bonus Amount</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={filters.minAmount}
                          onChange={(e) => setFilters({...filters, minAmount: e.target.value})}
                        />
                        <span>to</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={filters.maxAmount}
                          onChange={(e) => setFilters({...filters, maxAmount: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Direct Deposit</label>
                      <Select 
                        value={filters.directDeposit} 
                        onValueChange={(value) => setFilters({...filters, directDeposit: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Any</SelectItem>
                          <SelectItem value="required">Required</SelectItem>
                          <SelectItem value="not_required">Not Required</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Sort By</label>
                      <div className="flex items-center space-x-2">
                        <Select 
                          value={sortBy} 
                          onValueChange={(value) => setSortBy(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Bonus Amount" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bonus_amount">Bonus Amount</SelectItem>
                            <SelectItem value="interest_rate">Interest Rate</SelectItem>
                            <SelectItem value="holding_period">Holding Period</SelectItem>
                            <SelectItem value="expiration_date">Expiration Date</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        >
                          <SortDesc className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setFilters({
                        bankId: 'all',
                        minAmount: '',
                        maxAmount: '',
                        directDeposit: 'all',
                      })}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        )}

        {/* Bonuses Grid */}
        <div className="md:col-span-3">
          {/* Results summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredBonuses.length} {filteredBonuses.length === 1 ? 'bonus' : 'bonuses'}
            </p>
            
            {/* Sort dropdown for mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <Select 
                value={sortBy} 
                onValueChange={(value) => setSortBy(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bonus_amount">Bonus Amount</SelectItem>
                  <SelectItem value="interest_rate">Interest Rate</SelectItem>
                  <SelectItem value="holding_period">Holding Period</SelectItem>
                  <SelectItem value="expiration_date">Expiration Date</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                <SortDesc className={`h-4 w-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`} />
              </Button>
            </div>
          </div>
          
          {filteredBonuses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium mb-2">No bonuses found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search term.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setFilters({
                        bankId: 'all',
                        minAmount: '',
                        maxAmount: '',
                        directDeposit: 'all',
                      });
                    }}
                  >
                    Reset All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBonuses.map(bonus => (
                <BonusCard 
                  key={bonus.id} 
                  bonus={bonus} 
                  onTrack={handleTrackBonus} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BonusCatalog;

