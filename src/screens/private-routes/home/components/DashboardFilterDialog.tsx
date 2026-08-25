import { Button } from '@/components/ui/button';
import { DateField } from '@/components/ui/date-field';
import { DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/react-native-reusables/utils';
import { useWindowDimensions, View } from 'react-native';

import { DashboardMonthNav } from './DashboardMonthNav';

export type DashboardFilterMode = 'month' | 'range';

interface DashboardFilterDialogProps {
  mode: DashboardFilterMode;
  onModeChange: (mode: DashboardFilterMode) => void;
  offset: number;
  onOffsetChange: (offset: number) => void;
  offsetLabel: string;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onApply: () => void;
}

export function DashboardFilterDialog({
  mode,
  onModeChange,
  offset,
  onOffsetChange,
  offsetLabel,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DashboardFilterDialogProps) {
  const canApply = mode === 'month' || (startDate !== '' && endDate !== '' && startDate <= endDate);

  // The dialog's overlay centers its content with no defined width, so a
  // percentage className can't resolve against anything - compute a real
  // pixel width from the screen instead.
  const { width: screenWidth } = useWindowDimensions();
  const dialogWidth = Math.min(screenWidth * 0.92, 480);

  return (
    <DialogContent style={{ width: dialogWidth, maxWidth: dialogWidth }}>
      <DialogHeader>
        <DialogTitle>Filtrar período</DialogTitle>
      </DialogHeader>

      <View className="flex-row gap-2">
        <Button
          className={cn('flex-1')}
          variant={mode === 'month' ? 'default' : 'outline'}
          onPress={() => onModeChange('month')}>
          <Text>Mês</Text>
        </Button>
        <Button
          className={cn('flex-1')}
          variant={mode === 'range' ? 'default' : 'outline'}
          onPress={() => onModeChange('range')}>
          <Text>Período personalizado</Text>
        </Button>
      </View>

      {mode === 'month' ? (
        <View className="gap-2">
          <DashboardMonthNav
            label={offsetLabel}
            onPrevious={() => onOffsetChange(offset - 1)}
            onNext={() => onOffsetChange(offset + 1)}
            isNextDisabled={offset >= 0}
          />
          <Button variant="ghost" size="sm" onPress={() => onOffsetChange(0)} disabled={offset === 0}>
            <Text>Mês atual</Text>
          </Button>
        </View>
      ) : (
        <View className="gap-3">
          <View className="gap-1.5">
            <Label>Data inicial</Label>
            <DateField value={startDate} onChange={onStartDateChange} />
          </View>
          <View className="gap-1.5">
            <Label>Data final</Label>
            <DateField value={endDate} onChange={onEndDateChange} />
          </View>
          {startDate && endDate && startDate > endDate && (
            <Text className="text-sm text-error">A data final não pode ser antes da inicial.</Text>
          )}
        </View>
      )}

      <DialogFooter>
        <Button onPress={onApply} disabled={!canApply}>
          <Text>Aplicar</Text>
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
