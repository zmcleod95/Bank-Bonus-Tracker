import { useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import StatusBadge from '@/components/common/StatusBadge';
import useStore from '@/lib/store';
import { usePlayer } from '@/context/PlayerContext';
import { formatCurrency } from '@/lib/utils';

const Comparison = () => {
  const { playerNames } = usePlayer();
  const { 
    fetchBonuses, 
    fetchBanks, 
    fetchTrackedBonuses,
    getDashboardData,
    getTrackedBonusesByPlayer
  } = useStore();

  // Fetch data on component mount
  useEffect(() => {
    fetchBonuses();
    fetchBanks();
    fetchTrackedBonuses();
  }, [fetchBonuses, fetchBanks, fetchTrackedBonuses]);

  // Get dashboard data
  const dashboardData = getDashboardData();
  
  // Get tracked bonuses for both players
  const player1TrackedBonuses = getTrackedBonusesByPlayer(1);
  const player2TrackedBonuses = getTrackedBonusesByPlayer(2);
  
  // Prepare data for charts
  const earningsData = [
    {
      name: 'Total Earnings',
      [playerNames[1]]: dashboardData.players[0]?.totalEarned || 0,
      [playerNames[2]]: dashboardData.players[1]?.totalEarned || 0,
    },
    {
      name: 'Pending Amount',
      [playerNames[1]]: dashboardData.players[0]?.pendingBonusAmount || 0,
      [playerNames[2]]: dashboardData.players[1]?.pendingBonusAmount || 0,
    },
  ];
  
  const bonusCountData = [
    {
      name: 'Completed',
      [playerNames[1]]: dashboardData.players[0]?.completedBonuses || 0,
      [playerNames[2]]: dashboardData.players[1]?.completedBonuses || 0,
    },
    {
      name: 'Active',
      [playerNames[1]]: dashboardData.players[0]?.pendingBonuses || 0,
      [playerNames[2]]: dashboardData.players[1]?.pendingBonuses || 0,
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Player Comparison</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Player Cards */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{playerNames[1]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Earned:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(dashboardData.players[0]?.totalEarned || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Bonuses:</span>
                  <span className="font-medium">
                    {dashboardData.players[0]?.completedBonuses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(dashboardData.players[0]?.pendingBonusAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Bonuses:</span>
                  <span className="font-medium">
                    {dashboardData.players[0]?.pendingBonuses || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">{playerNames[2]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Total Earned:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(dashboardData.players[1]?.totalEarned || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Bonuses:</span>
                  <span className="font-medium">
                    {dashboardData.players[1]?.completedBonuses || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Amount:</span>
                  <span className="font-medium">
                    {formatCurrency(dashboardData.players[1]?.pendingBonusAmount || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Bonuses:</span>
                  <span className="font-medium">
                    {dashboardData.players[1]?.pendingBonuses || 0}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Household Total */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Household Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Earned</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(dashboardData.household.totalEarned)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Completed Bonuses</p>
              <p className="text-xl font-bold">
                {dashboardData.household.completedBonuses}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-xl font-bold">
                {formatCurrency(dashboardData.household.pendingBonusAmount)}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Bonuses</p>
              <p className="text-xl font-bold">
                {dashboardData.household.pendingBonuses}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Earnings Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={earningsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `$${value}`} />
                  <Tooltip formatter={(value) => [`$${value}`, '']} />
                  <Legend />
                  <Bar dataKey={playerNames[1]} fill="#3b82f6" />
                  <Bar dataKey={playerNames[2]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Bonus Count Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bonusCountData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey={playerNames[1]} fill="#3b82f6" />
                  <Bar dataKey={playerNames[2]} fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Bonuses Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Active Bonuses Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">{playerNames[1]}</h3>
              {player1TrackedBonuses
                .filter(tb => tb.is_active && tb.status !== 'completed' && tb.status !== 'failed')
                .length === 0 ? (
                <p className="text-sm text-muted-foreground">No active bonuses</p>
              ) : (
                <ul className="space-y-2">
                  {player1TrackedBonuses
                    .filter(tb => tb.is_active && tb.status !== 'completed' && tb.status !== 'failed')
                    .map(tb => (
                      <li key={tb.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{tb.bonus?.title || 'Unknown Bonus'}</p>
                          <p className="text-xs text-muted-foreground">{tb.bank?.name || 'Unknown Bank'}</p>
                        </div>
                        <StatusBadge status={tb.status} />
                      </li>
                    ))}
                </ul>
              )}
            </div>
            
            <div>
              <h3 className="font-medium mb-3">{playerNames[2]}</h3>
              {player2TrackedBonuses
                .filter(tb => tb.is_active && tb.status !== 'completed' && tb.status !== 'failed')
                .length === 0 ? (
                <p className="text-sm text-muted-foreground">No active bonuses</p>
              ) : (
                <ul className="space-y-2">
                  {player2TrackedBonuses
                    .filter(tb => tb.is_active && tb.status !== 'completed' && tb.status !== 'failed')
                    .map(tb => (
                      <li key={tb.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{tb.bonus?.title || 'Unknown Bonus'}</p>
                          <p className="text-xs text-muted-foreground">{tb.bank?.name || 'Unknown Bank'}</p>
                        </div>
                        <StatusBadge status={tb.status} />
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comparison;

