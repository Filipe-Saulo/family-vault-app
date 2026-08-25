import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { COUNTRIES, DEFAULT_COUNTRY, countryCodeToFlagEmoji, type Country } from '@/lib/countries';
import { ChevronDown } from 'lucide-react-native';
import * as React from 'react';
import { FlatList, Pressable, View } from 'react-native';

interface PhoneFieldProps {
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
}

function stripDialCode(value: string): string {
  return value.replace(/^\+\d+\s*/, '');
}

function PhoneField({ value, onChange, onBlur, placeholder = 'Número de telefone' }: PhoneFieldProps) {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(DEFAULT_COUNTRY);
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');

  const nationalNumber = stripDialCode(value ?? '');

  const handleChangeNumber = (text: string) => {
    const digits = text.replace(/\D/g, '');
    onChange(`${selectedCountry.dialCode} ${digits}`.trimEnd());
  };

  const handleSelectCountry = (country: Country) => {
    setSelectedCountry(country);
    setPickerOpen(false);
    setSearch('');
    onChange(`${country.dialCode} ${nationalNumber}`.trimEnd());
  };

  const filteredCountries = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return COUNTRIES;
    return COUNTRIES.filter(
      (country) => country.name.toLowerCase().includes(query) || country.dialCode.includes(query)
    );
  }, [search]);

  return (
    <>
      <View className="dark:bg-input/30 border-input bg-background flex h-10 flex-row items-center rounded-md border shadow-sm shadow-black/5 sm:h-9">
        <Pressable
          onPress={() => setPickerOpen(true)}
          className="border-input h-full flex-row items-center gap-1.5 border-r px-3">
          <Text className="text-base">{countryCodeToFlagEmoji(selectedCountry.code)}</Text>
          <Text className="text-foreground text-base">{selectedCountry.dialCode}</Text>
          <Icon as={ChevronDown} className="text-muted-foreground size-3.5" />
        </Pressable>
        <Input
          className="h-full flex-1 border-0 bg-transparent shadow-none"
          value={nationalNumber}
          onChangeText={handleChangeNumber}
          onBlur={onBlur}
          keyboardType="phone-pad"
          placeholder={placeholder}
        />
      </View>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="max-h-[80%]">
          <DialogTitle>Selecione o país</DialogTitle>
          <Input
            value={search}
            onChangeText={setSearch}
            placeholder="Buscar por nome ou DDI"
            autoCapitalize="none"
          />
          <FlatList
            data={filteredCountries}
            keyExtractor={(country) => country.code}
            className="max-h-96"
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelectCountry(item)}
                className="active:bg-accent flex-row items-center gap-3 rounded-md px-2 py-2.5">
                <Text className="text-lg">{countryCodeToFlagEmoji(item.code)}</Text>
                <Text className="flex-1">{item.name}</Text>
                <Text className="text-muted-foreground">{item.dialCode}</Text>
              </Pressable>
            )}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { PhoneField };
