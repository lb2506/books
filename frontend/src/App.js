import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/navbar/navbar"
import Home from "./components/home/home"
import SignUp from "./components/signup/signup"
import Login from "./components/login/login"
import AdminPanel from "./components/admin/adminPanel/adminPanel";
import UserBooksList from "./components/user/userBooksList/userBooksList";
import NotFound from "./components/notFound/notFound";
import AddBook from "./components/admin/addBook/addBook"


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/adminPanel/addBook" element={<AddBook />} />
          <Route path="/booksList" element={<UserBooksList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
