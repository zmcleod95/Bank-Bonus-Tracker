import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, PiggyBank, Clock, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatCard from '@/components/dashboard/StatCard';
import DateCard from '@/components/dashboard/DateCard';
import TrackedBonusCard from '@/components/tracking/TrackedBonusCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { usePlayer } from '@/context/PlayerContext';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

const Dashboard = () => {
  const { currentPlayer, currentPlayerName } = usePlayer();
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTrackedBonuses, setActiveTrackedBonuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Memoized fetch function to prevent unnecessary re-renders
  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    setError(null);
    
    try {
      // Fetch data in parallel for better performance
      const [dashboardResponse, trackedBonusesResponse] = await Promise.all([
        api.getDashboardData(),
        api.getPlayerTrackedBonuses(currentPlayer)
      ]);
      
      setDashboardData(dashboardResponse);
      
      // Filter and limit active tracked bonuses for dashboard
      const activeTracked = trackedBonusesResponse
        .filter(tb => tb.is_active && !['completed', 'failed', 'expired'].includes(tb.status))
        .slice(0, 3); // Limit to 3 for performance
      
      setActiveTrackedBonuses(activeTracked);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [currentPlayer]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized player stats calculation
  const playerStats = useMemo(() => {
    if (!dashboardData?.players) {
      return {
        totalEarned: 0,
        completedBonuses: 0,
        pendingBonusAmount: 0,
        pendingBonuses: 0
      };
    }
    
    return dashboardData.players.find(p => p.playerId === currentPlayer) || {
      totalEarned: 0,
      completedBonuses: 0,
      pendingBonusAmount: 0,
      pendingBonuses: 0
    };
  }, [dashboardData, currentPlayer]);

  // Memoized upcoming dates calculation
  const upcomingDates = useMemo(() => {
    if (!dashboardData?.upcomingDates) return [];
    
    return dashboardData.upcomingDates
      .filter(date => date.playerId === currentPlayer)
      .map(date => {
        let title = '';
        let description = '';
        
        if (date.status === 'account_opened' && date.directDepositRequired && !date.directDepositComplete) {
          title = 'Direct Deposit Due';
          description = `For ${date.bankName} ${date.bonusTitle?.split(' ').pop() || ''}`;
        } else if (date.status === 'requirements_met') {
          title = 'Bonus Expected';
          description = `From ${date.bankName}`;
        } else if (date.earliestWithdrawalDate) {
          title = 'Holding Period Ends';
          description = `For ${date.bankName}`;
        }
        
        return {
          date: date.earliestWithdrawalDate,
          title,
          description
        };
      })
      .filter(date => date.title)
      .slice(0, 5); // Limit for performance
  }, [dashboardData, currentPlayer]);

  // Memoized household stats calculation
  const householdStats = useMemo(() => {
    if (!dashboardData?.household) {
      return {
        totalEarned: 0,
        completedBonuses: 0,
        pendingBonusAmount: 0,
        pendingBonuses: 0
      };
    }
    
    return dashboardData.household;
  }, [dashboardData]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    // Clear cache and refetch
    api.clearCache();
    fetchData(true);
  }, [fetchData]);

  // Handle updating a tracked bonus
  const handleUpdateTrackedBonus = useCallback(async (trackedBonus) => {
    // This would open a dialog in a real implementation
    console.log('Update tracked bonus:', trackedBonus);
  }, []);

  // Handle editing a tracked bonus
  const handleEditTrackedBonus = useCallback(async (trackedBonus) => {
    // This would open a dialog in a real implementation
    console.log('Edit tracked bonus:', trackedBonus);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner text="Loading dashboard data..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <p className="text-red-500">Error loading dashboard data</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <div className="space-x-2">
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
            <Button onClick={() => window.location.reload()}>
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{currentPlayerName}'s Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleRefresh} 
            variant="outline" 
            size="sm"
            disabled={isRefreshing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link to="/tracking" className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Track New Bonus
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Earnings" 
          value={formatCurrency(playerStats.totalEarned)}
          icon={DollarSign}
          valueClassName="text-green-600"
        />
        <StatCard 
          title="Completed Bonuses" 
          value={playerStats.completedBonuses}
          icon={PiggyBank}
        />
        <StatCard 
          title="Pending Amount" 
          value={formatCurrency(playerStats.pendingBonusAmount)}
          icon={Clock}
        />
        <StatCard 
          title="Active Bonuses" 
          value={playerStats.pendingBonuses}
          icon={PiggyBank}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Active Tracked Bonuses */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold tracking-tight">Active Tracked Bonuses</h2>
          
          {activeTrackedBonuses.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-6">
                  <h3 className="text-lg font-medium mb-2">No active bonuses</h3>
                  <p className="text-muted-foreground mb-4">Start tracking bank bonuses to see them here.</p>
                  <Button asChild>
                    <Link to="/bonuses">Browse Bonuses</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {activeTrackedBonuses.map(trackedBonus => (
                <TrackedBonusCard 
                  key={trackedBonus.id}
                  trackedBonus={trackedBonus}
                  bonus={trackedBonus.bonus}
                  bank={trackedBonus.bank}
                  onUpdate={handleUpdateTrackedBonus}
                  onEdit={handleEditTrackedBonus}
                />
              ))}
              
              {activeTrackedBonuses.length < playerStats.pendingBonuses && (
                <Card className="flex items-center justify-center">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        {playerStats.pendingBonuses - activeTrackedBonuses.length} more active {playerStats.pendingBonuses - activeTrackedBonuses.length === 1 ? 'bonus' : 'bonuses'}
                      </p>
                      <Button asChild variant="outline">
                        <Link to="/tracking">View All</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Important Dates */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Important Dates</h2>
            <DateCard dates={upcomingDates} />
          </div>
          
          {/* Household Total */}
          <div>
            <h2 className="text-xl font-semibold tracking-tight mb-4">Household Total</h2>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Combined Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Earned:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(householdStats.totalEarned)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Completed Bonuses:</span>
                    <span className="font-medium">
                      {householdStats.completedBonuses}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pending Amount:</span>
                    <span className="font-medium">
                      {formatCurrency(householdStats.pendingBonusAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Bonuses:</span>
                    <span className="font-medium">
                      {householdStats.pendingBonuses}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

