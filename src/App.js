 
import './App.css'; 

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; 
import { onAuthStateChanged } from 'firebase/auth';//mapeia se a auth do usuario foi feita com sucesso controla a auth do user

import { useState, useEffect } from 'react';
import { useAuthentication } from './hooks/useAuthentication';

//context
import { AuthProvider } from './context/AuthContext';

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import CreatePost from './pages/CreatePost/CreatePost';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Post from './pages/Post/Post';
import EditPost from './pages/EditPost/EditPost';

function App() { 
  //chamando o usuario monitrando o status dele 

  const [user, setUser] = useState(undefined);
  const {auth} = useAuthentication(); 

  const loadingUser = user === undefined;//se for undefined está carregando não vou exibir nada antes do user ser carregado 
  
  useEffect(() =>{
    //vai ser executado baseado no valor da auth sempre que mudar a auth ele vai ser executado estou mapeando  
    onAuthStateChanged(auth, (user) => {
      setUser(user);//mesmo que nao venha o usuario vai vir algo diferendo do undefined
    });
  }, [auth])
  
    if(loadingUser){
      return <p>Carregando...</p>;
    }
  
  return (
    <div className="App">
       <AuthProvider value={{ user }}>{/* agora consigo acessar o usuario em todos os locais*/}
       <BrowserRouter>
          <Navbar/>
            <div className="container">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/search" element={<Search/>}/>
                    <Route path="/posts/:id" element={<Post/>}/>
                    <Route 
                    path="/login" 
                    element={!user ? <Login/> : <Navigate to="/"/>}/>
                    <Route 
                    path="/register" 
                    element={!user ? <Register/> : <Navigate to="/"/>}/>
                    <Route 
                    path="/posts/edit/:id" 
                    element={user ? <EditPost/> : <Navigate to="/login"/> }/>
                    <Route 
                    path="/posts/create" 
                    element={user ? <CreatePost/> : <Navigate to="/login"/> }/>
                    <Route 
                    path="/dashboard" 
                    element={user ? <Dashboard/> : <Navigate to="/login"/> }/>
                </Routes>
            </div> 
            <Footer/>
        </BrowserRouter>
       </AuthProvider>
    </div>
  );
}

export default App;
