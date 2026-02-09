import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AuthContext } from '@/context/AuthContext';

interface TeacherOnlyProps {
  children: React.ReactNode;
}

export function TeacherOnly({ children }: TeacherOnlyProps) {
  const { hasRole } = useContext(AuthContext);

  if (!hasRole('teacher')) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Acesso restrito</Text>
        <Text style={styles.subtitle}>Somente docentes podem acessar esta área administrativa.</Text>
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC'
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8
  },
  subtitle: {
    textAlign: 'center',
    color: '#475569'
  }
});
