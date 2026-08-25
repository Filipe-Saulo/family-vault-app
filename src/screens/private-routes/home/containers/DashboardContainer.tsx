import { Dialog } from '@/components/ui/dialog';
import { dateOnlyToRangeBoundary, formatDateOnlyBR, getMonthRange } from '@/lib/month-range';
import { useDashboardSummary } from '@/services/dashboard/get-dashboard-summary-service';
import { useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { DashboardCategoryBreakdown } from '../components/DashboardCategoryBreakdown';
import { DashboardFilterButton } from '../components/DashboardFilterButton';
import { DashboardFilterDialog, type DashboardFilterMode } from '../components/DashboardFilterDialog';
import { DashboardSummaryCards } from '../components/DashboardSummaryCards';

type AppliedFilter =
  | { mode: 'month'; offset: number }
  | { mode: 'range'; startDate: string; endDate: string };

export function DashboardContainer() {
  const [filter, setFilter] = useState<AppliedFilter>({ mode: 'month', offset: 0 });
  const [dialogOpen, setDialogOpen] = useState(false);

  const [draftMode, setDraftMode] = useState<DashboardFilterMode>('month');
  const [draftOffset, setDraftOffset] = useState(0);
  const [draftStartDate, setDraftStartDate] = useState('');
  const [draftEndDate, setDraftEndDate] = useState('');

  const openDialog = () => {
    setDraftMode(filter.mode);
    setDraftOffset(filter.mode === 'month' ? filter.offset : 0);
    setDraftStartDate(filter.mode === 'range' ? filter.startDate : '');
    setDraftEndDate(filter.mode === 'range' ? filter.endDate : '');
    setDialogOpen(true);
  };

  const applyFilter = () => {
    setFilter(
      draftMode === 'month'
        ? { mode: 'month', offset: draftOffset }
        : { mode: 'range', startDate: draftStartDate, endDate: draftEndDate }
    );
    setDialogOpen(false);
  };

  const range =
    filter.mode === 'month'
      ? getMonthRange(filter.offset)
      : {
          startDate: dateOnlyToRangeBoundary(filter.startDate, 'start'),
          endDate: dateOnlyToRangeBoundary(filter.endDate, 'end'),
          label: `${formatDateOnlyBR(filter.startDate)} – ${formatDateOnlyBR(filter.endDate)}`,
        };

  const { data, isLoading } = useDashboardSummary({ startDate: range.startDate, endDate: range.endDate });

  return (
    <View className="gap-4">
      <DashboardFilterButton label={range.label} onPress={openDialog} />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DashboardFilterDialog
          mode={draftMode}
          onModeChange={setDraftMode}
          offset={draftOffset}
          onOffsetChange={setDraftOffset}
          offsetLabel={getMonthRange(draftOffset).label}
          startDate={draftStartDate}
          endDate={draftEndDate}
          onStartDateChange={setDraftStartDate}
          onEndDateChange={setDraftEndDate}
          onApply={applyFilter}
        />
      </Dialog>

      {isLoading || !data ? (
        <View className="items-center justify-center py-8">
          <ActivityIndicator />
        </View>
      ) : (
        <>
          <DashboardSummaryCards
            totalIncome={data.totalIncome}
            totalExpense={data.totalExpense}
            balance={data.balance}
          />
          <DashboardCategoryBreakdown byCategory={data.byCategory} />
        </>
      )}
    </View>
  );
}
