import { Eye, Edit, Trash2, Search, Download, ChevronLeft, ChevronRight, UserCog, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface User {
  id: number;
  usuario: string;
  email: string;
  rol: string;
  nombre?: string;
  apellido?: string;
  nombreEmpresa?: string;
  descripcion?: string;
  url?: string;
}

interface UsersTableProps {
  users: User[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onView?: (user: User) => void;
  onCreate?: (user: Partial<User> & { password?: string; nombre?: string; apellido?: string; nombreEmpresa?: string; descripcion?: string; url?: string }) => Promise<void>;
  onUpdate?: (id: number, user: Partial<User> & { password?: string; nombre?: string; apellido?: string; nombreEmpresa?: string; descripcion?: string; url?: string }) => Promise<void>;
  onChangeRole?: (userId: number, newRole: string) => void;
}

export default function UsersTable({
  users,
  totalPages,
  currentPage,
  onPageChange,
  onEdit,
  onDelete,
  onView,
  onCreate,
  onUpdate,
  onChangeRole
}: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedRol, setSelectedRol] = useState('CANDIDATO');
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    password: '',
    rol: 'CANDIDATO',
    nombre: '',
    apellido: '',
    nombreEmpresa: '',
    descripcion: '',
    url: ''
  });
  const [loading, setLoading] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' ||
      user.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === '' || user.rol === filterRol;
    return matchesSearch && matchesRol;
  });

  const getRoleBadge = (rol: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-red-100 text-red-700',
      RECRUITER: 'bg-blue-100 text-blue-700',
      CANDIDATO: 'bg-green-100 text-green-700',
    };
    return styles[rol] || 'bg-gray-100 text-gray-700';
  };

  const getRoleLabel = (rol: string) => {
    const labels: Record<string, string> = {
      ADMIN: 'Administrador',
      RECRUITER: 'Reclutador',
      CANDIDATO: 'Candidato',
    };
    return labels[rol] || rol;
  };

  const handleRoleChange = (userId: number, newRole: string) => {
    if (onChangeRole) {
      onChangeRole(userId, newRole);
    }
  };

  const openCreateModal = () => {
    console.log('🔵 DEBUG: Abriendo modal de creación');
    setEditingUser(null);
    setSelectedRol('CANDIDATO');
    setFormData({
      usuario: '',
      email: '',
      password: '',
      rol: 'CANDIDATO',
      nombre: '',
      apellido: '',
      nombreEmpresa: '',
      descripcion: '',
      url: ''
    });
    setShowModal(true);
  };

  const openEditModal = (user: User) => {
    console.log('🔵 DEBUG: Abriendo modal de edición para usuario:', user.usuario);
    setEditingUser(user);
    setSelectedRol(user.rol);
    setFormData({
      usuario: user.usuario,
      email: user.email,
      password: '',
      rol: user.rol,
      nombre: user.nombre || '',
      apellido: user.apellido || '',
      nombreEmpresa: user.nombreEmpresa || '',
      descripcion: user.descripcion || '',
      url: user.url || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    console.log('\n🔵 === DEBUG INICIO handleSubmit ===');
    console.log('🔵 selectedRol:', selectedRol);
    console.log('🔵 formData:', {
      usuario: formData.usuario,
      email: formData.email,
      password: formData.password ? '***' : '(vacío)',
      nombre: formData.nombre,
      apellido: formData.apellido,
      nombreEmpresa: formData.nombreEmpresa,
      descripcion: formData.descripcion,
      url: formData.url
    });

    if (!formData.usuario || !formData.email) {
      toast.error('Usuario y email son obligatorios');
      return;
    }

    if (selectedRol === 'CANDIDATO' && (!formData.nombre || !formData.apellido)) {
      console.error('🔴 DEBUG: Validación fallida - CANDIDATO sin nombre/apellido');
      console.error('   nombre:', formData.nombre);
      console.error('   apellido:', formData.apellido);
      toast.error('Para candidatos, nombre y apellido son obligatorios');
      return;
    }

    if (selectedRol === 'RECRUITER' && !formData.nombreEmpresa) {
      console.error('🔴 DEBUG: Validación fallida - RECRUITER sin empresa');
      toast.error('Para reclutadores, el nombre de la empresa es obligatorio');
      return;
    }

    setLoading(true);
    try {
      if (editingUser && onUpdate) {
        console.log('🟡 DEBUG: Modo ACTUALIZACIÓN de usuario');
        const updateData: any = {
          usuario: formData.usuario,
          email: formData.email,
          rol: selectedRol,
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        
        if (selectedRol === 'CANDIDATO') {
          updateData.nombre = formData.nombre;
          updateData.apellido = formData.apellido;
          updateData.candidato = {
            nombre: formData.nombre,
            apellido: formData.apellido,
          };
        } else if (selectedRol === 'RECRUITER') {
          updateData.nombreEmpresa = formData.nombreEmpresa;
          updateData.descripcion = formData.descripcion;
          updateData.url = formData.url;
          updateData.empresa = {
            nombreEmpresa: formData.nombreEmpresa,
            descripcion: formData.descripcion,
            url: formData.url,
          };
        } else if (selectedRol === 'ADMIN') {
          updateData.nombre = formData.nombre;
          updateData.apellido = formData.apellido;
          updateData.admin = {
            nombre: formData.nombre,
            apellido: formData.apellido,
          };
        }
        
        console.log('🟡 DEBUG: Payload UPDATE:', JSON.stringify(updateData, null, 2));
        await onUpdate(editingUser.id, updateData);
        toast.success('Usuario actualizado correctamente');
        
      } else if (onCreate) {
        console.log('🟢 DEBUG: Modo CREACIÓN de usuario');
        
        if (!formData.password) {
          console.error('🔴 DEBUG: Contraseña obligatoria para nuevo usuario');
          toast.error('La contraseña es obligatoria para nuevos usuarios');
          return;
        }
        
        const createData: any = {
          usuario: formData.usuario,
          email: formData.email,
          password: formData.password,
          rol: selectedRol,
        };
        
        if (selectedRol === 'CANDIDATO') {
          // ✅ Enviar TANTO campos planos como anidados
          createData.nombre = formData.nombre;
          createData.apellido = formData.apellido;
          createData.candidato = {
            nombre: formData.nombre,
            apellido: formData.apellido,
          };
          console.log('🟢 DEBUG: Estructura CANDIDATO - nombre:', createData.nombre, 'apellido:', createData.apellido);
          console.log('🟢 DEBUG: Estructura CANDIDATO anidada:', createData.candidato);
        } else if (selectedRol === 'RECRUITER') {
          createData.nombreEmpresa = formData.nombreEmpresa;
          createData.descripcion = formData.descripcion || '';
          createData.url = formData.url || '';
          createData.empresa = {
            nombreEmpresa: formData.nombreEmpresa,
            descripcion: formData.descripcion || '',
            url: formData.url || '',
          };
          console.log('🟢 DEBUG: Estructura RECRUITER:', createData.empresa);
        } else if (selectedRol === 'ADMIN') {
          createData.nombre = formData.nombre;
          createData.apellido = formData.apellido;
          createData.admin = {
            nombre: formData.nombre,
            apellido: formData.apellido,
          };
          console.log('🟢 DEBUG: Estructura ADMIN:', createData.admin);
        }
        
        console.log('🟢 DEBUG: Payload FINAL a enviar:', JSON.stringify(createData, null, 2));
        console.log('🟢 DEBUG: URL del endpoint:', '/admin/usuarios');
        console.log('🟢 DEBUG: Método HTTP:', 'POST');
        
        await onCreate(createData);
        console.log('🟢 DEBUG: Usuario creado exitosamente');
        toast.success('Usuario creado correctamente');
      }
      
      setShowModal(false);
      setFormData({
        usuario: '',
        email: '',
        password: '',
        rol: 'CANDIDATO',
        nombre: '',
        apellido: '',
        nombreEmpresa: '',
        descripcion: '',
        url: ''
      });
      
    } catch (error: any) {
      console.log('\n🔴 === DEBUG ERROR ===');
      console.log('🔴 Status code:', error.response?.status);
      console.log('🔴 Response data:', error.response?.data);
      console.log('🔴 Error message:', error.message);
      
      if (error.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente');
      } else {
        const errorMsg = error.response?.data || error.message || 'Error al guardar el usuario';
        toast.error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg));
      }
    } finally {
      setLoading(false);
      console.log('🔵 === DEBUG FIN handleSubmit ===\n');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 w-64 rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <select
            value={filterRol}
            onChange={(e) => setFilterRol(e.target.value)}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm text-foreground focus:border-primary focus:outline-none"
          >
            <option value="">Todos los roles</option>
            <option value="ADMIN">Administradores</option>
            <option value="RECRUITER">Reclutadores</option>
            <option value="CANDIDATO">Candidatos</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nuevo Usuario
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary">
            <Download className="h-4 w-4" />
            Exportar
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Usuario</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Nombre/Empresa</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-border transition-colors hover:bg-secondary/30">
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-foreground">{user.usuario}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {user.rol === 'CANDIDATO' ? `${user.nombre || ''} ${user.apellido || ''}` :
                      user.rol === 'RECRUITER' ? user.nombreEmpresa || '-' : '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getRoleBadge(user.rol)}`}>
                        {getRoleLabel(user.rol)}
                      </span>
                      {onChangeRole && (
                        <select
                          value={user.rol}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="rounded border border-border bg-transparent px-1 py-0.5 text-xs"
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="RECRUITER">Recruiter</option>
                          <option value="CANDIDATO">Candidato</option>
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {onView && (
                        <button onClick={() => onView(user)} className="rounded p-1 text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                      {onUpdate && (
                        <button onClick={() => openEditModal(user)} className="rounded p-1 text-green-600 hover:bg-green-50">
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(user)} className="rounded p-1 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Anterior
            </button>
            <span className="text-sm text-muted-foreground">
              Página {currentPage + 1} de {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="flex items-center gap-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50"
            >
              Siguiente
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Modal de Crear/Editar Usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
              </h2>
              <button onClick={() => setShowModal(false)} className="rounded p-1 text-muted-foreground hover:bg-secondary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground">Usuario *</label>
                <input
                  type="text"
                  value={formData.usuario}
                  onChange={(e) => {
                    console.log('🟢 Usuario cambiado:', e.target.value);
                    setFormData({ ...formData, usuario: e.target.value });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="nombre_usuario"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    console.log('🟢 Email cambiado:', e.target.value);
                    setFormData({ ...formData, email: e.target.value });
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="usuario@mail.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">
                  {editingUser ? 'Contraseña (dejar en blanco para no cambiar)' : 'Contraseña *'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground">Rol *</label>
                <select
                  value={selectedRol}
                  onChange={(e) => {
                    console.log('🟢 Rol cambiado a:', e.target.value);
                    setSelectedRol(e.target.value);
                  }}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                >
                  <option value="ADMIN">Administrador</option>
                  <option value="RECRUITER">Reclutador</option>
                  <option value="CANDIDATO">Candidato</option>
                </select>
              </div>

              {/* Campos para Candidato */}
              {selectedRol === 'CANDIDATO' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Nombre *</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => {
                        console.log('🟢 Nombre cambiado a:', e.target.value);
                        setFormData({ ...formData, nombre: e.target.value });
                      }}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      placeholder="Nombre del candidato"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Apellido *</label>
                    <input
                      type="text"
                      value={formData.apellido}
                      onChange={(e) => {
                        console.log('🟢 Apellido cambiado a:', e.target.value);
                        setFormData({ ...formData, apellido: e.target.value });
                      }}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      placeholder="Apellido del candidato"
                    />
                  </div>
                </>
              )}

              {/* Campos para Reclutador/Empresa */}
              {selectedRol === 'RECRUITER' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Nombre de la empresa *</label>
                    <input
                      type="text"
                      value={formData.nombreEmpresa}
                      onChange={(e) => setFormData({ ...formData, nombreEmpresa: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      placeholder="Nombre de la empresa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      placeholder="Descripción de la empresa"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Sitio web</label>
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                      placeholder="https://empresa.com"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (editingUser ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 