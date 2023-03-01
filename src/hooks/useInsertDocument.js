import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config"; 
//collection = cada lugar que salva algum dado tipo post ou categorias de posts etc
//addDoc faz o insert do documento do banco
import { collection, addDoc, Timestamp } from "firebase/firestore"; 
 
 

const initialState = {
    loading:null,
    error: null,
}

const insertReducer = (state,action) => {
    
    switch (action.type){
        case "LOADING":
            return {loading:true, error:null};
        case "INSERTED_DOC":
            return {loading:false, error:null};
        case "ERROR":
            return {loading:false, error:action.payload};
        default:
            return state;
    }


} 
//programador quando vai inserir algo no sistema vai informar qual a coleção dessa forma consigo inserir qualquer elemento 
//não apenas o post
export const useInsertDocument = (docCollection) => { 
                                        //trata os eventos 
    const [response, dispatch] = useReducer(insertReducer, initialState); 

    //impedir vazamento de memoria
    const [cancelled, setCancelled] = useState(false);

    const checkCancelledBeforeDispatch = (action) =>{
        if(!cancelled){
            dispatch(action)
        }
    }

    const insertDocument = async(document) =>{
        checkCancelledBeforeDispatch({
            type:"LOADING",//DISPACHANDO A AÇÃO DE LOADING
          })
    
        try {  
            const newDocument = {...document, createdAt: Timestamp.now()}

            const insertedDocument = await addDoc(
                collection(db, docCollection),// procura no banco a coleção que passei no arg da função
                newDocument //insere o doc nessa coleção
           ) 

           checkCancelledBeforeDispatch({
             type:"INSERTED_DOC",
             payload: insertedDocument //dado
           })

        } catch (error) {
           checkCancelledBeforeDispatch({
            type:"INSERTED_DOC",
            payload: error.message //pasando erro pro payload
          })
        }
    }   

    //impedindo vazamento de memoria encerra o componente
    useEffect(() =>{
        return () => setCancelled(true)
    }, [])

    return { insertDocument, response } //retorno a response pra poder estar sempre em contato com o reducer
}   