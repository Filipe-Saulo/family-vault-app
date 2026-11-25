import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import { logout } from '@/lib/session';
import type { ProfileStackRoutes } from '@/navigation/private-routes/profile-stack/profileRoutes';
import { useDeleteUser } from '@/services/user/delete-user-service';
import { useMe } from '@/services/user/get-me-service';
import { useAuthStore } from '@/store/authStore';

import { ThemeToggle } from '../components/ThemeToggle';

export function ProfileContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackRoutes>>();
  const userId = useAuthStore((state) => state.userId);
  const { data: me } = useMe();
  const { mutate: deleteUser, isPending: isDeleting, error: deleteError, reset: resetDelete } = useDeleteUser();

  const handleDeleteAccount = () => {
    if (!userId) return;
    deleteUser(userId, { onSuccess: () => logout() });
  };

  return (
    <View className="gap-4">
      {me ? (
        <View className="gap-1">
          <Text className="font-medium">{me.fullName}</Text>
          <Text variant="muted" className="text-xs">
            {me.email || me.phoneNumber}
          </Text>
        </View>
      ) : (
        <Text variant="muted" className="text-xs">
          ID da conta: {userId}
        </Text>
      )}

      <Button variant="outline" onPress={() => navigation.navigate('profileEdit')}>
        <Text>Editar perfil</Text>
      </Button>

      <Button variant="outline" onPress={() => navigation.navigate('changePassword')}>
        <Text>Trocar senha</Text>
      </Button>

      <Button variant="outline" onPress={() => navigation.navigate('mcpTokens')}>
        <Text>Tokens do MCP</Text>
      </Button>

      <ThemeToggle />

      <ConfirmDialog
        trigger={
          <Button variant="destructive">
            <Text>Excluir conta</Text>
          </Button>
        }
        title="Excluir conta"
        description="Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita."
        isConfirming={isDeleting}
        errorMessage={deleteError?.message}
        onOpen={resetDelete}
        onConfirm={handleDeleteAccount}
      />

      <Button onPress={() => logout()}>
        <Text>Sair</Text>
      </Button>
    </View>
  );
}
