//vai me trazer um array vazio ou os dados que eu quero

import { useState, useEffect } from "react"; 
import { db } from "../firebase/config";
import { 
 doc, getDoc
} from "firebase/firestore";  
 
                            //coleção onde estou pegando os dados
export const useFetchDocument = (docCollection, id) => {

    const  [document, setDocument] = useState(null);
    const  [error, setError] = useState(null);
    const  [loading, setLoading] = useState(null);
    
    //impedir vazamento de memoria ex mudar pagina durante o carregamento e cancelado
    const [cancelled, setCancelled] = useState(false); 

    useEffect(() =>{

    async function loadDocument(){
        if(cancelled) return;

         try {    
            const docRef = await doc(db, docCollection, id); 
            const docSnap = await getDoc(docRef); //pegando dado do firebase 

            setDocument(docSnap.data());//obtendo os dados que vieram do metodo getdoc
            setLoading(false);
         } catch (error) {   
                console.log(error);
                setError(error.message) 

                setLoading(true);
         }

    }

    
    loadDocument(); //sempre que mudar os estados vou chamar a load data so vai ser executado quando um desses dados 
    //forem alterados

    }, [docCollection, id, cancelled])//mapeando



    useEffect(() =>{
        return () => setCancelled(true);
    }, []) 

    return {document, loading, error}; 
    //retorna como objeto para conseguir acessar os itens individualmente
}





//não preciso do reducer por que não tenho ações só preciso carregar os dados