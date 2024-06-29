import React from 'react';
import { db } from './firebaseConfig';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

interface Presente {
  id: string;
  nome: string;
  descricao: string;
  fotoUrl: string;
  linkCompra: string;
}

interface PresentesProps {
  presentes: Presente[];
  convidadoId: string;
}

const Presentes: React.FC<PresentesProps> = ({ presentes, convidadoId }) => {
  const handleCurtir = async (presenteId: string) => {
    const convidadoDocRef = doc(db, 'convidados', convidadoId);
    await updateDoc(convidadoDocRef, {
      presentesCurtidos: arrayUnion(presenteId)
    });
  };

  return (
    <div>
      <h2>Presentes Sugeridos</h2>
      <ul>
        {presentes.map(presente => (
          <li key={presente.id}>
            <h3>{presente.nome}</h3>
            <img src={presente.fotoUrl} alt={presente.nome} />
            <p>{presente.descricao}</p>
            <a href={presente.linkCompra} target="_blank" rel="noopener noreferrer">Comprar</a>
            <button onClick={() => handleCurtir(presente.id)}>Curtir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Presentes;
