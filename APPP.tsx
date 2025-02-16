import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemList from './pages/ItemLists';
import ItemForm from './pages/ItemForms';
import ItemDetails from './pages/ItemDetails';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<ItemList />} />
        <Route path="/list" element={<ItemList />} />
        <Route path="/form" element={<ItemForm />} />
        <Route path="/form/:id" element={<ItemForm />} />
        <Route path="/item/:id" element={<ItemDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
