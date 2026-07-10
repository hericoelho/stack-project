import { useState } from 'react';
import { useCreateActivity } from './hooks/useCreateActivity.hook';

function CreateActivityForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('STUDY');

  const { createActivity, isPending, error } = useCreateActivity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createActivity({ title, description, type });
  };

  return (
    <div>
      <h1>Criar Atividade</h1>
      {error && <p>{error.message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descrição</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>Plan
        <div>
          <label htmlFor="type">Tipo</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="STUDY">Estudo</option>
            <option value="PROJECT">Projeto</option>
            <option value="READING">Leitura</option>
            <option value="EVENT">Evento</option>
          </select>
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Criando...' : 'Criar'}
        </button>
      </form>
    </div>
  );
}

export default CreateActivityForm;