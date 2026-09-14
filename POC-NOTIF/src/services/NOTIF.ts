import { Platform, Vibration } from 'react-native';
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Emite a notificação física de vibração no dispositivo.
 */
export function emitirNotificacaoDispositivo(): void {
  try {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      // Padrão de vibração: espera 0ms, vibra 250ms, pausa 100ms, vibra 250ms
      Vibration.vibrate([0, 250, 100, 250]);
    }
  } catch (erro) {
    console.warn('Erro ao emitir vibração:', erro);
  }
}

/**
 * Registra um novo alerta na coleção 'notificacoes' do Firestore.
 */
export async function registrarAlertaNoFirestore(
  titulo: string,
  mensagem: string
): Promise<string> {
  try {
    const notificacoesRef = collection(db, 'notificacoes');

    const docRef = await addDoc(notificacoesRef, {
      titulo: titulo.trim(),
      mensagem: mensagem.trim(),
      data: serverTimestamp()
    });

    return docRef.id;
  } catch (erro) {
    console.error('Erro ao salvar no Firestore:', erro);
    throw erro;
  }
}

/**
 * Escuta novos alertas em tempo real no Firestore.
 */
export function escutarNotificacoesFirestore(
  aoReceberNovoAlerta: (titulo: string, mensagem: string) => void
): Unsubscribe {
  const q = query(
    collection(db, 'notificacoes'),
    orderBy('data', 'desc'),
    limit(1)
  );

  let primeiraCarga = true;

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      // Ignora os dados já existentes no banco no momento em que a tela abre
      if (primeiraCarga) {
        primeiraCarga = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        // Verifica se a mudança é um novo documento e se ele não possui pendências de gravação local incompletas
        if (change.type === 'added' && !change.doc.metadata.hasPendingWrites) {
          const dados = change.doc.data();
          if (dados.titulo && dados.mensagem) {
            emitirNotificacaoDispositivo();
            aoReceberNovoAlerta(dados.titulo, dados.mensagem);
          }
        }
      });
    },
    (erro) => {
      console.error('Erro no listener em tempo real do Firestore:', erro);
    }
  );

  return unsubscribe;
}