import { Platform, Vibration } from 'react-native';
//Platform  → identifica se é Android ou iOS
//Vibration → faz o dispositivo vibrar
import {
  collection,     //acessa uma coleção
  addDoc,         //adiciona um documento
  query,          //cria uma consulta
  orderBy,        //ordena os resultados
  limit,          //limita quantos documentos retornar
  onSnapshot,     //escuta mudanças em tempo real
  serverTimestamp //registra data/hora do servidor
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
  titulo: string = 'Novo alerta',
  mensagem: string = 'O botão foi pressionado!'
): Promise<string> {
  const notificacoesRef = collection(db, 'notificacoes');

  const docRef = await addDoc(notificacoesRef, {
    titulo,
    mensagem,
    data: serverTimestamp()
  });

  return docRef.id;
}

/**
 * Escuta novos alertas em tempo real no Firestore.
 */
export function escutarNotificacoesFirestore(
  aoReceberNovoAlerta: (titulo: string, mensagem: string) => void
) {
//Observe a coleção notificacoes, ordene pelos alertas mais recentes e considere apenas o último.
  const q = query(
    collection(db, 'notificacoes'),
    orderBy('data', 'desc'),
    limit(1)
  );

  let primeiraCarga = true;

//O Firestore avisa quando a consulta muda usando o onSnapshot
  const unsubscribe = onSnapshot(q, (snapshot) => {
    // Ignora a leitura inicial dos documentos antigos já existentes no banco
    if (primeiraCarga) {
      primeiraCarga = false;
      return;
    }

//Essa mudança aconteceu porque um novo documento foi adicionado?
    snapshot.docChanges().forEach((change) => {
      if (change.type === 'added') {
        const dados = change.doc.data();
        if (dados.titulo && dados.mensagem) {
          emitirNotificacaoDispositivo();
          aoReceberNovoAlerta(dados.titulo, dados.mensagem);
        }
      }
    });
  }, (erro) => {
    console.error('Erro no listener do Firestore:', erro);
  });

  return unsubscribe;
}