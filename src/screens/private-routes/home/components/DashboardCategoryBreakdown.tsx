import { View } from 'react-native';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { PurposeCode } from '@/types/enums/purpose-code';
import type { DashboardSummary } from '@/types/entities/dashboard-summary';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface DashboardCategoryBreakdownProps {
  byCategory: DashboardSummary['byCategory'];
}

export function DashboardCategoryBreakdown({ byCategory }: DashboardCategoryBreakdownProps) {
  const maxTotal = Math.max(1, ...byCategory.map((item) => item.total));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Por categoria</CardTitle>
      </CardHeader>
      <CardContent className="gap-3">
        {byCategory.length === 0 && (
          <Text variant="muted" className="text-center">
            Nenhuma transação neste período.
          </Text>
        )}
        {byCategory.map((item) => {
          const isIncome = item.transactionTypeCode === PurposeCode.Income;
          const widthPercent = Math.max(4, Math.round((item.total / maxTotal) * 100));

          return (
            <View key={`${item.categoryId}-${item.transactionTypeId}`} className="gap-1">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm">{item.categoryDescription}</Text>
                <Text className={isIncome ? 'text-sm font-medium text-success' : 'text-sm font-medium text-error'}>
                  {currencyFormatter.format(item.total)}
                </Text>
              </View>
              <View className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <View
                  className={isIncome ? 'h-full rounded-full bg-success' : 'h-full rounded-full bg-error'}
                  style={{ width: `${widthPercent}%` }}
                />
              </View>
            </View>
          );
        })}
      </CardContent>
    </Card>
  );
}
