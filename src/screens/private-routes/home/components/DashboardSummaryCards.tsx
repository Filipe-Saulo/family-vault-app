import { View } from 'react-native';

import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

const currencyFormatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

interface DashboardSummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export function DashboardSummaryCards({ totalIncome, totalExpense, balance }: DashboardSummaryCardsProps) {
  return (
    <View className="gap-3">
      <Card>
        <CardContent className="flex-row items-center justify-between">
          <Text variant="muted">Receitas</Text>
          <Text className="font-medium text-success">{currencyFormatter.format(totalIncome)}</Text>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex-row items-center justify-between">
          <Text variant="muted">Despesas</Text>
          <Text className="font-medium text-error">{currencyFormatter.format(totalExpense)}</Text>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="flex-row items-center justify-between">
          <Text variant="muted">Saldo</Text>
          <Text className={balance >= 0 ? 'font-medium text-success' : 'font-medium text-error'}>
            {currencyFormatter.format(balance)}
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}
