import React, { useContext, useEffect } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import { ROUTES } from '@/utils/constants';

export function AdminPostsScreen() {
  const navigation = useNavigation();
  const { posts, loadPosts, deletePost } = useContext(AppDataContext);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleDelete(postId: string) {
    try {
      await deletePost(postId);
      Alert.alert('Postagens', 'Post removido com sucesso.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover post.';
      Alert.alert('Postagens', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>Por {item.author}</Text>
              <View style={styles.actions}>
                <PrimaryButton
                  label="Editar"
                  variant="outline"
                  onPress={() => (navigation as any).navigate(ROUTES.postEdit as never, { postId: item.id } as never)}
                />
                <PrimaryButton label="Excluir" variant="danger" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhuma postagem cadastrada.</Text>}
        />
      </SafeAreaView>
    </TeacherOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  },
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700'
  },
  subtitle: {
    color: '#475569',
    marginBottom: 8
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});
