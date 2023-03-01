//vai me trazer um array vazio ou os dados que eu quero

import { useState, useEffect } from "react"; 
import { db } from "../firebase/config";
import { 
collection, 
query, //query pega os dados
orderBy, 
onSnapshot, 
where //filtro dos resultaodos
} from "firebase/firestore";  
 
                            //coleção onde estou pegando os dados
export const useFetchDocuments = (docCollection, search = null, uid = null ) => {

    const  [documents, setDocuments] = useState(null);
    const  [error, setError] = useState(null);
    const  [loading, setLoading] = useState(null);
    //impedir vazamento de memoria
    const [cancelled, setCancelled] = useState(false); 

    useEffect(() =>{

    async function loadData(){
        if(cancelled) return;

        setLoading(true);

        //vou conseguir utilizar essa ref em outros locais
        const collectionRef = await collection(db, docCollection);

        try { 

            let q; 

            //busca 
            //dashboard

            if (search) { 
                //ou vem a busca ou id do user ou vem nada 
                q = await query(
                    collectionRef, 
                    where("tagsArray", "array-contains", search), 
                    orderBy("createdAt", "desc"));
                
            }else if(uid){
                q = await query(
                    collectionRef, 
                    where("uid", "==", uid), //id do post igual o id do usuario
                    orderBy("createdAt", "desc"));
            }else{
                q = await query(collectionRef, orderBy("createdAt", "desc")) 
            }

            await onSnapshot(q, (querySnapshot) => {
                //trazer meus documentos
                setDocuments(
                    querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
            })//mapeando os dados sempre que tiver o dado alterado ele traz os dados renovados
            
            setLoading(false);

        } catch (error) {
            console.log(error);
            setError(error.message);

            setLoading(false);
        }
    }

    
    loadData(); //sempre que mudar os estados vou chamar a load data so vai ser executado quando um desses dados 
    //forem alterados

    }, [docCollection, search, uid, cancelled])//mapeando



    useEffect(() =>{
        return () => setCancelled(true);
    }, []) 

    return {documents, loading, error}; 
    //retorna como objeto para conseguir acessar os itens individualmente
}





//não preciso do reducer por que não tenho ações só preciso carregar os dados