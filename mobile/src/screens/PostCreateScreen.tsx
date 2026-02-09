import React, { useContext, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TextField } from '@/components/TextField';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';

export function PostCreateScreen() {
  const navigation = useNavigation();
  const { createPost } = useContext(AppDataContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');

  async function handleSubmit() {
    try {
      await createPost({ title, content, author });
      Alert.alert('Postagem', 'Post criado com sucesso.');
      navigation.goBack();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao criar post.';
      Alert.alert('Postagem', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <TextField label="Título" value={title} onChangeText={setTitle} placeholder="Digite o título" />
        <TextField label="Autor" value={author} onChangeText={setAuthor} placeholder="Nome do autor" />
        <TextField label="Conteúdo" value={content} onChangeText={setContent} placeholder="Conteúdo" multiline />
        <PrimaryButton label="Publicar" onPress={handleSubmit} />
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
