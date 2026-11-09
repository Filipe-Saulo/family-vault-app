import { Mail, MessageSquare } from 'lucide-react-native';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import type { VerificationMethod } from '@/schemas/services/account/contact-issues';

interface ChannelToggleProps {
  method: VerificationMethod;
  onChange: (method: VerificationMethod) => void;
}

export function ChannelToggle({ method, onChange }: ChannelToggleProps) {
  return (
    <View className="flex-row gap-2">
      <Button className="flex-1" variant={method === 'sms' ? 'default' : 'outline'} onPress={() => onChange('sms')}>
        <Icon as={MessageSquare} />
        <Text>SMS</Text>
      </Button>
      <Button className="flex-1" variant={method === 'email' ? 'default' : 'outline'} onPress={() => onChange('email')}>
        <Icon as={Mail} />
        <Text>E-mail</Text>
      </Button>
    </View>
  );
}
