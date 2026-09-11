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
    // Inicia a escuta em tempo real do Firestore
    const unsubscribe = escutarNotificacoesFirestore((titulo, mensagem) => {
      const hora = new Date().toLocaleTimeString();
      setUltimaNotificacao({ titulo, mensagem, hora });
    });

    // Cancela o listener ao desmontar o componente
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const dispararAlerta = async () => {
    setCarregando(true);
    setMensagemStatus('Registrando alerta no Firestore...');

    try {
      const docId = await registrarAlertaNoFirestore(
        'Novo alerta',
        'O botão foi pressionado!'
      );
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