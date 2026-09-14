import { useState, useEffect } from 'react';
import {
  registrarAlertaNoFirestore,
  escutarNotificacoesFirestore,
} from '../services/NOTIF';

export function useNotificacoes() {
  const [carregando, setCarregando] = useState<boolean>(false);
  const [mensagemStatus, setMensagemStatus] = useState<string>('🟢 Conectado ao Firestore (Tempo Real Ativo)');
  const [ultimaNotificacao, setUltimaNotificacao] = useState<{ titulo: string; mensagem: string; hora: string } | null>(null);

  useEffect(() => {
    const unsubscribe = escutarNotificacoesFirestore((titulo, mensagem) => {
      const hora = new Date().toLocaleTimeString();
      setUltimaNotificacao({ titulo, mensagem, hora });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Agora recebe os valores dinâmicos passados pela interface
  const dispararAlerta = async (titulo: string, mensagem: string) => {
    if (!titulo.trim() || !mensagem.trim()) {
      setMensagemStatus('⚠️ Preencha o título e a mensagem antes de enviar.');
      return;
    }

    setCarregando(true);
    setMensagemStatus('Registrando alerta no Firestore...');

    try {
      const docId = await registrarAlertaNoFirestore(titulo, mensagem);
      setMensagemStatus(`Alerta enviado com sucesso! (Doc: ${docId.substring(0, 8)}...)`);
    } catch (erro: any) {
      console.error('Erro ao disparar alerta:', erro);
      setMensagemStatus(`Falha ao enviar alerta: ${erro?.message || erro}`);
    } finally {
      setCarregando(false);
    }
  };

  return {
    carregando,
    mensagemStatus,
    ultimaNotificacao,
    dispararAlerta,
  };
}