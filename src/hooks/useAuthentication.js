import { db } from "../firebase/config";

import {
    //funçõs que vou usar depois
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
} from "firebase/auth"; 

import { useState, useEffect } from "react";


export const useAuthentication = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(null);

    //cleanup
    //deal with memory leak

    const [cancelled, setCancelled] = useState(false);//cancela ações futuras do componente

    const auth = getAuth();//vem do firebase eu consigo utilizar funções de auth a partir dele

    function checkIfIsCancelled(){//evita vazamento de memoria(cleanup)
        if(cancelled){
            return;
        }
    }

    // register
     const createUser = async (data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(null);

        try {
            const {user} = await createUserWithEmailAndPassword(
                //pegando os dados do user
                auth,//obrigatorio
                data.email,
                data.password
            );

            //atualização do user para colocar o nome 
            await updateProfile(user, {
                displayName: data.displayName, //atualiza o usuario com o nome que enviou
            }) 
 
            setLoading(false);

            return user;

        } catch (error) {
            console.log(error.message);
            console.log(typeof error.message);

            let systemErrorMessage

            if(error.message.includes("Password")){
                systemErrorMessage = "A senha precisa conter pelo menos 6 caracteres";
            }else if(error.message.includes("email-already")){
                //usuario ja cadastrado
                systemErrorMessage = "E-mail já cadastrado";
            }else{
                //erro de sistema
                systemErrorMessage = "Ocorreu um erro por favor tente mais tarde";
            } 
            setLoading(false)
            setError(systemErrorMessage);
        }


     }  
     //logout 
     const logout = () => { 

        checkIfIsCancelled();

        signOut(auth)
     } 

     //login 

     const login = async(data) => {
        checkIfIsCancelled();

        setLoading(true);
        setError(false)

        try { 
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setLoading(false);
        } catch (error) {
            let systemErrorMessage;

            if(error.message.includes("user-not-found")){
               systemErrorMessage = "Usuário não encontrado.";  
            }else if(error.message.includes("wrong-password")){
                systemErrorMessage = "Senha Incorreta";
            }else{
                systemErrorMessage = "Ocorreu um erro, por favor tente mais tarde";
            } 
            setError(systemErrorMessage);
            setLoading(false);
        }
     }

     //vai colocar o cancelado como true assim que sair da pagina
     useEffect(() => {
      return (() => setCancelled(true));//para nao ter vazamento de memoria
     }, [])

     return{
        auth,
        createUser,
        error,
        loading,
        logout,
        login,
     };
}