import { useLocation } from "react-router-dom";
//o valor fica salvo consigo referenciar um objeto para que eu consiga fazer a comparação dele como se o objeto js 
//tivesse uma chave unica e consigo saber se foi modificado
import { useMemo } from "react";

export function useQuery(){
    const { search } = useLocation();

    return useMemo(() => new URLSearchParams(search), [search]);//busca o parametro que eu determinar na busca e entrega esse parametro pra mim so vai ser executado quando o search for alterado
}