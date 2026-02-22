import React, { useState, useEffect } from 'react';

// --- Tipos e Interfaces ---
export interface Task {
  id?: number;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at?: string;
  updated_at?: string;
  due_date: string | null;
  owner?: number; 
}

type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

// Reemplaza esto con la URL real de tu API
const API_URL = 'http://localhost:8000/api/tasks/';

const TaskScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  
  // Estados para manejar la UI de creación/edición
  const [isCreating, setIsCreating] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  
  // Estado del formulario
  const [formData, setFormData] = useState<Task>({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    due_date: ''
  });

  // --- Llamadas a la API ---
  const fetchTasks = async () => {
    try {
      const url = filter === 'all' ? API_URL : `${API_URL}?status=${filter}`;
      // NOTA: Si tu endpoint está protegido, asegúrate de enviar el Token aquí
      const response = await fetch(url);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  const handleSave = async () => {
    try {
      // Ajusta el owner_id según cómo manejes la sesión actual en el frontend
      const payload = { ...formData, owner: 1 }; 
      
      const isEdit = editingTaskId !== null;
      const url = isEdit ? `${API_URL}${editingTaskId}/` : API_URL;
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        resetForm();
        fetchTasks();
      }
    } catch (error) {
      console.error("Error saving task:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) return;
    try {
      await fetch(`${API_URL}${id}/`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // --- Funciones Auxiliares ---
  const resetForm = () => {
    setIsCreating(false);
    setEditingTaskId(null);
    setFormData({ title: '', description: '', status: 'pending', priority: 'medium', due_date: '' });
  };

  const startEditing = (task: Task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      due_date: task.due_date || ''
    });
    setEditingTaskId(task.id!);
    setIsCreating(false);
  };

  // --- Renderizado de UI ---
  
  // Diccionarios de colores para UX
  const statusColors = {
    pending: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800'
  };

  const priorityColors = {
    low: 'bg-emerald-100 text-emerald-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header y Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Gestión de Tareas</h1>
          
          <div className="flex bg-white rounded-lg shadow-sm p-1 border border-gray-200">
            {['all', 'pending', 'in_progress', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as FilterStatus)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Grid de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Tarjeta de Creación (Botón "+" o Formulario en línea) */}
          {!isCreating && editingTaskId === null ? (
            <button 
              onClick={() => setIsCreating(true)}
              className="flex flex-col items-center justify-center min-h-[250px] border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-indigo-400 transition-all text-gray-500 hover:text-indigo-500 cursor-pointer"
            >
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Nueva Tarea</span>
            </button>
          ) : (
            (isCreating) && (
              <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-5 flex flex-col gap-3 min-h-[250px]">
                <h3 className="font-semibold text-indigo-700">Crear Nueva Tarea</h3>
                <input 
                  type="text" placeholder="Título" autoFocus
                  className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-indigo-500"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                />
                <textarea 
                  placeholder="Descripción" rows={2}
                  className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <label className="text-xs text-gray-500">Prioridad</label>
                    <select 
                      className="w-full border rounded p-1"
                      value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Task['priority']})}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Fecha Límite</label>
                    <input 
                      type="date" className="w-full border rounded p-1"
                      value={formData.due_date || ''} onChange={e => setFormData({...formData, due_date: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-auto pt-2">
                  <button onClick={resetForm} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                  <button onClick={handleSave} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Guardar</button>
                </div>
              </div>
            )
          )}

          {/* Listado de Tareas */}
          {tasks.map((task) => {
            // Renderizar el formulario si esta tarjeta está en modo edición
            if (editingTaskId === task.id) {
              return (
                <div key={task.id} className="bg-white rounded-xl shadow-lg border border-indigo-200 p-5 flex flex-col gap-3 min-h-[250px]">
                  <input 
                    type="text" className="w-full border-b border-gray-300 p-2 focus:outline-none focus:border-indigo-500 font-bold"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                  <textarea 
                    rows={2} className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-indigo-500"
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <label className="text-xs text-gray-500">Estado</label>
                      <select 
                        className="w-full border rounded p-1"
                        value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as Task['status']})}
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">Prioridad</label>
                      <select 
                        className="w-full border rounded p-1"
                        value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value as Task['priority']})}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-auto pt-2">
                    <button onClick={resetForm} className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded">Cancelar</button>
                    <button onClick={handleSave} className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700">Actualizar</button>
                  </div>
                </div>
              );
            }

            // Renderizar la tarjeta normal de lectura
            return (
              <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col hover:shadow-md transition-shadow min-h-[250px] relative group">
                
                {/* Badges */}
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${statusColors[task.status]}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${priorityColors[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2">{task.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description || 'Sin descripción'}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-xs text-gray-500 flex flex-col">
                    {task.due_date && <span>Vence: {task.due_date}</span>}
                  </div>
                  
                  {/* Botones de acción (visibles al pasar el mouse) */}
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditing(task)} className="p-1.5 text-blue-600 bg-blue-50 rounded hover:bg-blue-100" title="Editar">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => handleDelete(task.id!)} className="p-1.5 text-red-600 bg-red-50 rounded hover:bg-red-100" title="Eliminar">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}


export default TaskScreen;