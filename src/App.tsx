import React, { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import Presentes from './Presentes';

interface Convidado {
  id: string;
  nome: string;
  email: string;
  presentesCurtidos: string[];
}

interface Presente {
  id: string;
  nome: string;
  descricao: string;
  fotoUrl: string;
  linkCompra: string;
}

const App: React.FC = () => {
  const [convidado, setConvidado] = useState<Convidado | null>(null);
  const [presentes, setPresentes] = useState<Presente[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const convidadoId = urlParams.get('id');

    if (convidadoId) {
      const convidadoDocRef = doc(db, 'convidados', convidadoId);
      getDoc(convidadoDocRef).then(doc => {
        if (doc.exists()) {
          setConvidado({ id: doc.id, ...doc.data() } as Convidado);
        } else {
          console.error("Convidado não encontrado");
        }
      });
    }

    const presentesColRef = collection(db, 'presentes');
    getDocs(presentesColRef).then(snapshot => {
      const presentesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Presente[];
      setPresentes(presentesList);
    });
  }, []);

  return (
    <div>
      {convidado ? (
        <div>
          <h1>Bem-vindo, {convidado.nome}!</h1>
          <p>Estamos felizes em convidá-lo para nosso chá de casa nova e aniversário.</p>
          <Presentes presentes={presentes} convidadoId={convidado.id} />
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default App;
