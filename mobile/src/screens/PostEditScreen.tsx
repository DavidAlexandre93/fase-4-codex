import React, { useContext, useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';

interface PostEditParams {
  postId: string;
}

export function PostEditScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, PostEditParams>, string>>();
  const { getPost, updatePost } = useContext(AppDataContext);
  const { postId } = route.params as PostEditParams;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    async function loadPost() {
      const data = await getPost(postId);
      setTitle(data.title);
      setContent(data.content);
      setAuthor(data.author);
    }

    loadPost();
  }, [postId, getPost]);

  async function handleSubmit() {
    try {
      await updatePost(postId, { title, content, author });
      Alert.alert('Postagem', 'Post atualizado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao atualizar post.';
      Alert.alert('Postagem', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
        <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
        <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Conteúdo" multiline />
        <PrimaryButton label="Salvar alterações" onPress={handleSubmit} />
      </SafeAreaView>
    </TeacherOnly>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F1F5F9'
  }
});
