import { ActivityIndicator, View } from 'react-native';

import { useDashboardSummary } from '@/services/dashboard/get-dashboard-summary-service';

import { DashboardCategoryBreakdown } from '../components/DashboardCategoryBreakdown';
import { DashboardSummaryCards } from '../components/DashboardSummaryCards';

export function DashboardContainer() {
  const { data, isLoading } = useDashboardSummary({});

  if (isLoading || !data) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="gap-4">
      <DashboardSummaryCards
        totalIncome={data.totalIncome}
        totalExpense={data.totalExpense}
        balance={data.balance}
      />
      <DashboardCategoryBreakdown byCategory={data.byCategory} />
    </View>
  );
}
