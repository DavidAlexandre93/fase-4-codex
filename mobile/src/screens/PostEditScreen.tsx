import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { apiRequest } from '@/api/client';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import type { Post } from '@/types';

interface PostEditParams {
  postId: string;
}

export function PostEditScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, PostEditParams>, string>>();
  const { postId } = route.params as PostEditParams;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setIsLoading(true);
        const data = await apiRequest<Post>(`/posts/${postId}`);
        setTitle(data.title);
        setContent(data.content);
        setAuthor(data.author);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erro ao carregar dados do post.';
        Alert.alert('Postagem', message, [{ text: 'Voltar', onPress: () => navigation.goBack() }]);
      } finally {
        setIsLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  async function handleSubmit() {
    if (!title.trim() || !content.trim() || !author.trim()) {
      Alert.alert('Postagem', 'Preencha título, autor e conteúdo antes de salvar.');
      return;
    }

    try {
      setIsSaving(true);
      await apiRequest(`/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          author: author.trim()
        })
      });
      Alert.alert('Postagem', 'Post atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar post.';
      Alert.alert('Postagem', message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
      {isLoading ? (
        <Text style={styles.loading}>Carregando dados atuais da postagem...</Text>
      ) : (
        <>
          <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
          <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
          <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Conteúdo" multiline />
          <PrimaryButton
            label={isSaving ? 'Salvando...' : 'Salvar alterações'}
            onPress={handleSubmit}
            disabled={isSaving}
          />
        </>
      )}
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
  loading: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});
