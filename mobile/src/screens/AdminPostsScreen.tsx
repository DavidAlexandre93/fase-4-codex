import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import React, { useContext, useEffect } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import { ROUTES } from '@/utils/constants';

export function AdminPostsScreen() {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const data = await apiRequest<Post[]>('/posts');
      setPosts(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar postagens.';
      Alert.alert('Postagens', message);
    }
  }, []);
  const navigation = useNavigation();
  const { posts, loadPosts, deletePost } = useContext(AppDataContext);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      loadPosts().finally(() => setIsLoading(false));
    }, [loadPosts])
  );

  async function handleRefresh() {
    setIsRefreshing(true);
    await loadPosts();
    setIsRefreshing(false);
  }

  async function handleDelete(postId: string) {
    try {
      await deletePost(postId);
      Alert.alert('Postagens', 'Post removido com sucesso.');
      await loadPosts();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover post.';
      Alert.alert('Postagens', message);
    }
  }

  function confirmDelete(postId: string, postTitle: string) {
    Alert.alert('Excluir postagem', `Deseja excluir a postagem "${postTitle}"?`, [
      {
        text: 'Cancelar',
        style: 'cancel'
      },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => {
          handleDelete(postId);
        }
      }
    ]);
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#334155" />
            <Text style={styles.loaderText}>Carregando postagens...</Text>
          </View>
        ) : (
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
                    onPress={() => navigation.navigate(ROUTES.postEdit as never, { postId: item.id } as never)}
                  />
                  <PrimaryButton label="Excluir" variant="danger" onPress={() => confirmDelete(item.id, item.title)} />
                </View>
              </View>
            )}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>Nenhuma postagem cadastrada.</Text>}
          />
        )}
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
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loaderText: {
    marginTop: 8,
    color: '#475569'
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
