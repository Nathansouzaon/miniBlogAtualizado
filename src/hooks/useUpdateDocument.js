import { useState, useEffect, useReducer } from "react";
import { db } from "../firebase/config"; 
//collection = cada lugar que salva algum dado tipo post ou categorias de posts etc
//addDoc faz o insert do documento do banco 
//doc e pegar a ref do documento
import {  updateDoc, doc } from "firebase/firestore"; 
 
const initialState = {
    loading:null,
    error: null,
}

const updateReducer = (state,action) => {
    
    switch (action.type){
        case "LOADING":
            return {loading:true, error:null};
        case "UPDATE_DOC":
            return {loading:false, error:null};
        case "ERROR":
            return {loading:false, error:action.payload};
        default:
            return state;
    }


} 
//programador quando vai inserir algo no sistema vai informar qual a coleção dessa forma consigo inserir qualquer elemento 
//não apenas o post
export const useUpdateDocument = (docCollection) => { 
                                        //trata os eventos 
    const [response, dispatch] = useReducer(updateReducer, initialState); 

    //impedir vazamento de memoria
    const [cancelled, setCancelled] = useState(false);

    const checkCancelledBeforeDispatch = (action) =>{
        if(!cancelled){
            dispatch(action)
        }
    }

    const updateDocument = async(id, data) =>{
        checkCancelledBeforeDispatch({
            type:"LOADING",//DISPACHANDO A AÇÃO DE LOADING
          })
    
        try {  
            const docRef = await doc(db, docCollection, id) ;

            const updatedDocument = await updateDoc(docRef, data);

           checkCancelledBeforeDispatch({
             type:"UPDATE_DOC",
             payload: updatedDocument //dado
           })

        } catch (error) {
           checkCancelledBeforeDispatch({
            type:"UPDATE_DOC",
            payload: error.message //pasando erro pro payload
          })
        }
    }   

    //impedindo vazamento de memoria encerra o componente
    useEffect(() =>{
        return () => setCancelled(true)
    }, [])

    return { updateDocument, response } //retorno a response pra poder estar sempre em contato com o reducer
}   