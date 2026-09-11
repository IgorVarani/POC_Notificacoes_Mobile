import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';

export default function TelaPrincipal() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* BANNER DE NOTIFICAÇÃO FLUTUANTE */}
          <View style={styles.bannerNotificacao}>
            <View style={styles.bannerHeader}>
              <Text style={styles.bannerTag}>🔔 NOTIFICAÇÃO RECEBIDA</Text>
              <Text style={styles.bannerHora}>hora</Text>
            </View>
            <Text style={styles.bannerTitulo}>titulo</Text>
            <Text style={styles.bannerMensagem}>mensagem</Text>
          </View>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Teste de Notificações</Text>
          <Text style={styles.subtitulo}>
            Envie uma notificação para os dispositivos conectados.
          </Text>
        </View>

        {/* CARD COM BOTÃO DE AÇÃO */}
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.botao}
            activeOpacity={0.8}
          >
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.textoBotao}>Disparar Alerta</Text>
          </TouchableOpacity>

            <View style={styles.statusContainer}>
              <Text style={styles.textoStatus}>mensagem</Text>
            </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { padding: 24, justifyContent: 'center' },
  bannerNotificacao: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    elevation: 6,
  },
  bannerHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  bannerTag: { fontSize: 11, fontWeight: '800', color: '#E0E7FF' },
  bannerHora: { fontSize: 11, color: '#C7D2FE' },
  bannerTitulo: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
  bannerMensagem: { fontSize: 14, color: '#EEF2FF', marginTop: 2 },
  header: { marginTop: 20, marginBottom: 32, alignItems: 'center' },
  titulo: { fontSize: 28, fontWeight: '700', color: '#0F172A', textAlign: 'center' },
  subtitulo: { fontSize: 16, color: '#64748B', textAlign: 'center', marginTop: 8 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 3,
  },
  botao: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  botaoDesabilitado: { backgroundColor: '#818CF8' },
  textoBotao: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  statusContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  textoStatus: { color: '#3730A3', fontSize: 14, fontWeight: '500' },
});