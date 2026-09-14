import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import { useNotificacoes } from '../hooks/useNOTIF';

export default function TelaPrincipal() {
  const [titulo, setTitulo] = useState('');
  const [mensagem, setMensagem] = useState('');

  const {
    carregando,
    mensagemStatus,
    ultimaNotificacao,
    dispararAlerta,
  } = useNotificacoes();

  const handleEnviar = async () => {
    await dispararAlerta(titulo, mensagem);
    // Opcional: limpa os campos após o envio bem-sucedido
    setTitulo('');
    setMensagem('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
      <ScrollView contentContainerStyle={styles.container}>

        {/* BANNER DE NOTIFICAÇÃO FLUTUANTE */}
        {ultimaNotificacao && (
          <View style={styles.bannerNotificacao}>
            <View style={styles.bannerHeader}>
              <Text style={styles.bannerTag}>🔔 NOTIFICAÇÃO RECEBIDA</Text>
              <Text style={styles.bannerHora}>{ultimaNotificacao.hora}</Text>
            </View>
            <Text style={styles.bannerTitulo}>{ultimaNotificacao.titulo}</Text>
            <Text style={styles.bannerMensagem}>{ultimaNotificacao.mensagem}</Text>
          </View>
        )}

        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Text style={styles.titulo}>Enviar Notificação</Text>
          <Text style={styles.subtitulo}>
            Digite os dados abaixo para publicar um alerta em tempo real no Firestore.
          </Text>
        </View>

        {/* CARD COM FORMULÁRIO */}
        <View style={styles.card}>
          <Text style={styles.label}>Título</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Novo Alerta de Segurança"
            placeholderTextColor="#94A3B8"
            value={titulo}
            onChangeText={setTitulo}
          />

          <Text style={styles.label}>Mensagem</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Ex: Identificado um comportamento incomum..."
            placeholderTextColor="#94A3B8"
            value={mensagem}
            onChangeText={setMensagem}
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={[styles.botao, carregando && styles.botaoDesabilitado]}
            onPress={handleEnviar}
            disabled={carregando}
            activeOpacity={0.8}
          >
            {carregando ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.textoBotao}>Disparar Alerta</Text>
            )}
          </TouchableOpacity>

          {mensagemStatus ? (
            <View style={styles.statusContainer}>
              <Text style={styles.textoStatus}>{mensagemStatus}</Text>
            </View>
          ) : null}
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 16,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top',
  },
  botao: {
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
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
  textoStatus: { color: '#3730A3', fontSize: 14, fontWeight: '500', textAlign: 'center' },
});