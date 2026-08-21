import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Text } from '@/components/ui/text';
import type { ProfileStackRoutes } from '@/navigation/private-routes/profile-stack/profileRoutes';
import { useDeleteUser } from '@/services/user/delete-user-service';
import { useAuthStore } from '@/store/authStore';

import { ThemeToggle } from '../components/ThemeToggle';

export function ProfileContainer() {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackRoutes>>();
  const userId = useAuthStore((state) => state.userId);
  const logout = useAuthStore((state) => state.logout);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleDeleteAccount = () => {
    if (!userId) return;
    deleteUser(userId, { onSuccess: () => logout() });
  };

  return (
    <View className="gap-4">
      <Text variant="muted" className="text-xs">
        ID da conta: {userId}
      </Text>

      <Button variant="outline" onPress={() => navigation.navigate('profileEdit')}>
        <Text>Editar perfil</Text>
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
        onConfirm={handleDeleteAccount}
      />

      <Button onPress={logout}>
        <Text>Sair</Text>
      </Button>
    </View>
  );
}
