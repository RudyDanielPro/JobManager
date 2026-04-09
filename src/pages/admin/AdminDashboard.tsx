import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { useAdminData } from './hooks/useAdminData';
import AdminHeader from './components/AdminHeader';
import AdminSidebar, { TabType } from './components/AdminSidebar';
import AdminStats from './components/AdminStats';
import UsersTable from './components/UsersTable';
import CompaniesTable from './components/CompaniesTable';
import OffersTable from './components/OffersTable';
import PostulationsTable from './components/PostulationsTable';
import DeleteConfirmModal from './components/DeleteConfirmModal';

export default function AdminDashboard() {
  const { currentUser, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'user' | 'company' | 'offer';
    id: number;
    name: string;
  }>({ isOpen: false, type: 'user', id: 0, name: '' });

  const {
    loading,
    setLoading,
    stats,
    users,
    companies,
    offers,
    postulations,
    totalPages,
    currentPage,
    setCurrentPage,
    loadStats,
    loadUsers,
    loadCompanies,
    loadOffers,
    loadPostulations,
    createUser,
    updateUser,
    updateUserRole,
    deleteUser,
    deleteCompany,
    toggleOfferStatus,
    deleteOffer,
  } = useAdminData();

  if (!isAuthenticated || currentUser?.rol?.toLowerCase() !== 'admin') {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      if (activeTab === 'dashboard') {
        await loadStats();
      } else if (activeTab === 'users') {
        await loadUsers(currentPage);
      } else if (activeTab === 'companies') {
        await loadCompanies(currentPage);
      } else if (activeTab === 'offers') {
        await loadOffers(currentPage);
      } else if (activeTab === 'postulations') {
        await loadPostulations(currentPage);
      }
      setLoading(false);
    };
    loadData();
  }, [activeTab, currentPage]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setCurrentPage(0);
  };

  const handleDelete = () => {
    if (deleteModal.type === 'user') {
      deleteUser(deleteModal.id);
    } else if (deleteModal.type === 'company') {
      deleteCompany(deleteModal.id);
    } else if (deleteModal.type === 'offer') {
      deleteOffer(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, type: 'user', id: 0, name: '' });
  };

  const getTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Dashboard';
      case 'users': return 'Gestión de Usuarios';
      case 'companies': return 'Gestión de Empresas';
      case 'offers': return 'Gestión de Ofertas';
      case 'postulations': return 'Gestión de Postulaciones';
      default: return 'Panel de Administración';
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Resumen general del sistema';
      case 'users': return 'Administra los usuarios del sistema';
      case 'companies': return 'Gestiona las empresas registradas';
      case 'offers': return 'Controla las ofertas laborales';
      case 'postulations': return 'Revisa todas las postulaciones';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="ml-64">
        <AdminHeader title={getTitle()} subtitle={getSubtitle()} />

        <div className="container mx-auto px-6 py-8">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && stats && (
                <AdminStats stats={stats} />
              )}

              {activeTab === 'users' && (
                <UsersTable
                  users={users}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onChangeRole={updateUserRole}
                  onCreate={createUser}
                  onUpdate={updateUser}
                  onDelete={(user) => setDeleteModal({
                    isOpen: true,
                    type: 'user',
                    id: user.id,
                    name: user.usuario
                  })}
                />
              )}

              {activeTab === 'companies' && (
                <CompaniesTable
                  companies={companies}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onDelete={(company) => setDeleteModal({
                    isOpen: true,
                    type: 'company',
                    id: company.id,
                    name: company.nombreEmpresa
                  })}
                />
              )}

              {activeTab === 'offers' && (
                <OffersTable
                  offers={offers}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  onToggleStatus={toggleOfferStatus}
                  onDelete={(offer) => setDeleteModal({
                    isOpen: true,
                    type: 'offer',
                    id: offer.id,
                    name: offer.titulo
                  })}
                />
              )}

              {activeTab === 'postulations' && (
                <PostulationsTable
                  postulations={postulations}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar este ${deleteModal.type}?`}
        itemName={deleteModal.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ isOpen: false, type: 'user', id: 0, name: '' })}
      />
    </div>
  );
}