import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navbar/navbar"
import Home from "./components/home/home"
import Register from "./components/register/register"
import Login from "./components/login/login"
import AdminPanel from "./components/admin/adminPanel/adminPanel";
import UserBooksList from "./components/user/userBooksList/userBooksList";
import NotFound from "./components/notFound/notFound";
import AddBook from "./components/admin/addBook/addBook"
import FindLibrary from "./components/findLibrary/findLibrary"


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/adminPanel/addBook" element={<AddBook />} />
          <Route path="/booksList" element={<UserBooksList />} />
          <Route path="/findLibrary" element={<FindLibrary />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
