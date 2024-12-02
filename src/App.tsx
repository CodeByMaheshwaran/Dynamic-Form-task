// src/App.tsx
import React from 'react';
import DynamicForm from './components/DynamicForm';

const App = () => {
  return (

    <div className="min-h-screen flex flex-col justify-between">
      <header className="bg-gray-800 text-white text-center p-4">
        <h1 className="text-2xl">Dynamic Form</h1>
      </header>

      <main className="flex-1">
        <DynamicForm />
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2024 Dynamic Form. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default App;
