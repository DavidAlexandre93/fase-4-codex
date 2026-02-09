import React, { useContext, useEffect } from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PrimaryButton } from '@/components/PrimaryButton';
import { TeacherOnly } from '@/components/TeacherOnly';
import { AppDataContext } from '@/context/AppDataContext';
import { ROUTES } from '@/utils/constants';

export function TeachersListScreen() {
  const navigation = useNavigation();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function loadTeachers(currentPage: number) {
    setIsLoading(true);

    try {
      const response = await apiRequest<PaginatedResponse<Teacher>>(`/teachers?page=${currentPage}`);
      setTeachers(response.data);
      setPage(response.page);
      setTotalPages(response.totalPages);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar docentes.';
      Alert.alert('Docentes', message);
    } finally {
      setIsLoading(false);
    }
  }
  const { teachers, loadTeachers, deleteTeacher, teachersPage, teachersTotalPages } = useContext(AppDataContext);

  useEffect(() => {
    loadTeachers(1);
  }, [loadTeachers]);

  async function confirmDelete(teacherId: string) {
    Alert.alert('Excluir docente', 'Tem certeza que deseja excluir este docente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => handleDelete(teacherId)
      }
    ]);
  }

  async function handleDelete(teacherId: string) {
    try {
      await deleteTeacher(teacherId);
      Alert.alert('Docentes', 'Docente removido com sucesso.');
      const targetPage = teachers.length === 1 && page > 1 ? page - 1 : page;
      loadTeachers(targetPage);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao remover docente.';
      Alert.alert('Docentes', message);
    }
  }

  return (
    <TeacherOnly>
      <SafeAreaView style={styles.container}>
        <PrimaryButton label="Cadastrar docente" onPress={() => navigation.navigate(ROUTES.teacherForm as never)} />

        <View style={styles.tableHeader}>
          <Text style={[styles.columnLabel, styles.nameColumn]}>Nome</Text>
          <Text style={[styles.columnLabel, styles.emailColumn]}>Email</Text>
          <Text style={[styles.columnLabel, styles.actionColumn]}>Ações</Text>
        </View>

        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          refreshing={isLoading}
          onRefresh={() => loadTeachers(page)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.rowData}>
                <Text style={[styles.valueText, styles.nameColumn]} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={[styles.valueText, styles.emailColumn]} numberOfLines={1}>
                  {item.email}
                </Text>
                <View style={[styles.actions, styles.actionColumn]}>
                  <PrimaryButton
                    label="Editar"
                    variant="outline"
                    onPress={() => navigation.navigate(ROUTES.teacherForm as never, { teacherId: item.id } as never)}
                  />
                  <PrimaryButton label="Excluir" variant="danger" onPress={() => confirmDelete(item.id)} />
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={!isLoading ? <Text style={styles.empty}>Nenhum docente encontrado.</Text> : null}
        />

        <PrimaryButton label="Cadastrar docente" onPress={() => (navigation as any).navigate(ROUTES.teacherForm as never)} />
        <FlatList
          data={teachers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>{item.email}</Text>
              <View style={styles.actions}>
                <PrimaryButton
                  label="Editar"
                  variant="outline"
                  onPress={() => (navigation as any).navigate(ROUTES.teacherForm as never, { teacherId: item.id } as never)}
                />
                <PrimaryButton label="Excluir" variant="danger" onPress={() => handleDelete(item.id)} />
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>Nenhum docente encontrado.</Text>}
        />
        <View style={styles.pagination}>
          <PrimaryButton
            label="Anterior"
            variant="outline"
            onPress={() => loadTeachers(Math.max(1, page - 1))}
            disabled={page <= 1 || isLoading}
          />
          <Text style={styles.pageLabel}>
            Página {page} de {totalPages}
            onPress={() => loadTeachers(Math.max(1, teachersPage - 1))}
            disabled={teachersPage <= 1}
          />
          <Text style={styles.pageLabel}>
            Página {teachersPage} de {teachersTotalPages}
          </Text>
          <PrimaryButton
            label="Próxima"
            variant="outline"
            onPress={() => loadTeachers(Math.min(totalPages, page + 1))}
            disabled={page >= totalPages || isLoading}
            onPress={() => loadTeachers(Math.min(teachersTotalPages, teachersPage + 1))}
            disabled={teachersPage >= teachersTotalPages}
          />
        </View>
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
  tableHeader: {
    marginTop: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12
  },
  columnLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: '#64748B',
    fontWeight: '700'
  },
  card: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 12
  },
  rowData: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  valueText: {
    color: '#0F172A'
  },
  nameColumn: {
    flex: 1.2
  },
  emailColumn: {
    flex: 1.5
  },
  actionColumn: {
    flex: 1.8
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12
  },
  pageLabel: {
    color: '#475569'
  },
  empty: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 24
  }
});
