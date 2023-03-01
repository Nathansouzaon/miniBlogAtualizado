import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config"; 
//collection = cada lugar que salva algum dado tipo post ou categorias de posts etc
//addDoc faz o insert do documento do banco
import { doc, deleteDoc} from "firebase/firestore"; 
 
 

const initialState = {
    loading:null,
    error: null,
}

const deleteReducer = (state,action) => {
    
    switch (action.type){
        case "LOADING":
            return {loading:true, error:null};
        case "DELETED_DOC":
            return {loading:false, error:null};
        case "ERROR":
            return {loading:false, error:action.payload};
        default:
            return state;
    }


} 
//programador quando vai inserir algo no sistema vai informar qual a coleção dessa forma consigo inserir qualquer elemento 
//não apenas o post
export const useDeleteDocument = (docCollection) => { 
                                        //trata os eventos 
    const [response, dispatch] = useReducer(deleteReducer, initialState); 

    //impedir vazamento de memoria
    const [cancelled, setCancelled] = useState(false);

    const checkCancelledBeforeDispatch = (action) =>{
        if(!cancelled){
            dispatch(action)
        }
    }

    const deleteDocument = async(id) =>{
        checkCancelledBeforeDispatch({
            type:"LOADING",//DISPACHANDO A AÇÃO DE LOADING
          })
    
        try {  
            
            const deletedDocument = await deleteDoc(doc(db, docCollection, id))

           checkCancelledBeforeDispatch({
             type:"DELETED_DOC",
             payload: deletedDocument //dado
           })

        } catch (error) {
           checkCancelledBeforeDispatch({
            type:"ERROR",
            payload: error.message, //pasando erro pro payload
          })
        }
    }   

    //impedindo vazamento de memoria encerra o componente
    useEffect(() =>{
        return () => setCancelled(true)
    }, [])

    return { deleteDocument, response } //retorno a response pra poder estar sempre em contato com o reducer
}   