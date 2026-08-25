import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/react-native-reusables/utils';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { CalendarIcon } from 'lucide-react-native';
import * as React from 'react';
import { Platform, Pressable, View } from 'react-native';

interface DateFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

// Uses the Date object's local getters/setters (not toISOString, which is UTC
// and can shift the day) so the picker never disagrees with what the user tapped.
function parseIsoDate(value?: string): Date {
  if (!value) return new Date();
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(value?: string): string | undefined {
  if (!value) return undefined;
  const date = parseIsoDate(value);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
}

function DateField({ value, onChange, onBlur, placeholder = 'Selecione a data' }: DateFieldProps) {
  const [showIosPicker, setShowIosPicker] = React.useState(false);

  const openPicker = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: parseIsoDate(value),
        mode: 'date',
        onValueChange: (_event, selectedDate) => {
          if (selectedDate) onChange(toIsoDate(selectedDate));
          onBlur?.();
        },
      });
      return;
    }
    setShowIosPicker(true);
  };

  const displayValue = formatDisplayDate(value);

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={openPicker}
          className="dark:bg-input/30 border-input bg-background flex h-10 flex-1 flex-row items-center gap-2 rounded-md border px-3 py-1 shadow-sm shadow-black/5 sm:h-9">
          <Icon as={CalendarIcon} className="text-muted-foreground size-4" />
          <Text className={cn('text-base leading-5', !displayValue && 'text-muted-foreground/50')}>
            {displayValue ?? placeholder}
          </Text>
        </Pressable>
        <Button
          variant="outline"
          size="sm"
          onPress={() => {
            onChange(toIsoDate(new Date()));
            onBlur?.();
          }}>
          <Text>Hoje</Text>
        </Button>
      </View>

      {Platform.OS === 'ios' && showIosPicker && (
        <View className="bg-popover border-border rounded-md border p-2">
          <DateTimePicker
            value={parseIsoDate(value)}
            mode="date"
            display="inline"
            onValueChange={(_event, selectedDate) => {
              if (selectedDate) onChange(toIsoDate(selectedDate));
            }}
            onDismiss={() => setShowIosPicker(false)}
          />
        </View>
      )}
    </View>
  );
}

export { DateField };
