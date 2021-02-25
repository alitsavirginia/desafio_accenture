import React, { FormEvent, useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { IToken } from '../../components/cardLogin';
import { Container } from '../../components/cardLogin/style';
import api from '../../services/api';
import { ContainerPassRequest } from './style';

// import { Container } from './styles';

const PassRequest: React.FC = () => {
    const history = useHistory();

    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");


    const [senhaProvisoria, setSenhaProvisoria] = useState<IToken>((): any => {
        let storageSenha = () => localStorage.getItem('@tempPass')
        console.log(storageSenha);
        return storageSenha();
    })

    useEffect(() => {
        !!senhaProvisoria
            ?
            history.push('/recovery')
            :
            localStorage.clear()
    }, [senhaProvisoria])

    function handlePassRequest(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const dataRequest = {
            login: login,
            senhaTemporaria: senhaProvisoria
        }

        try {
            api.post("/nova-senha", dataRequest).then(
                response => {
                    localStorage.setItem('@tempPass', response.data);
                    alert('Sua senha foi enviada para o seu email, registre uma nova!');
                    setEmail("");
                    setLogin("");

                    history.push('/recovery')
                }
            )
        } catch (error) {
            console.log(error.message)
        }

    }

    return (
        <ContainerPassRequest>
            <Container>
                <form onSubmit={handlePassRequest}>
                    <h1>Solicitar nova Senha</h1>
                    <input type="email" placeholder="Digite o seu email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <input type="text" placeholder="Digite seu nome de usuário" value={login} onChange={(e) => setLogin(e.target.value)} required />
                    <button type="submit">
                        Continuar <FiArrowRight size={25} />
                    </button>

                </form>

            </Container>
        </ContainerPassRequest>
    )
}

export default PassRequest;