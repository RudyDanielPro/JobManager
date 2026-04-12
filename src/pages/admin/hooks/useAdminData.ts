import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService, DashboardStats } from '@/lib/adminService';
import type { User, Empresa, OfertaLaboral, Postulacion } from '@/lib/types';

const defaultStats: DashboardStats = {
  totalUsers: 0,
  totalCandidates: 0,
  totalCompanies: 0,
  totalAdmins: 0,
  totalOffers: 0,
  activeOffers: 0,
  totalPostulations: 0,
  pendingPostulations: 0,
};

export function useAdminData() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>(defaultStats);
  const [users, setUsers] = useState<User[]>([]);
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [offers, setOffers] = useState<OfertaLaboral[]>([]);
  const [postulations, setPostulations] = useState<Postulacion[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const loadStats = useCallback(async () => {
    try {
      const data = await adminService.getStats();
      let totalAdmins = data.totalAdmins;
      
      if (totalAdmins === undefined || totalAdmins === null) {
        const usersResponse = await adminService.getUsers(0, 1000);
        totalAdmins = usersResponse.content.filter(u => u.rol === 'ADMIN').length;
      }
      
      setStats({
        ...data,
        totalUsers: data.totalUsers ?? 0,
        totalCandidates: data.totalCandidates ?? 0,
        totalCompanies: data.totalCompanies ?? 0,
        totalAdmins: totalAdmins ?? 0,
        totalOffers: data.totalOffers ?? 0,
        activeOffers: data.activeOffers ?? 0,
        totalPostulations: data.totalPostulations ?? 0,
        pendingPostulations: data.pendingPostulations ?? 0,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      setStats(defaultStats);
    }
  }, []);

  const loadUsers = useCallback(async (page: number, rol?: string) => {
    try {
      const response = await adminService.getUsers(page, 10, rol);
      setUsers(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
      setTotalPages(0);
    }
  }, []);

  const loadCompanies = useCallback(async (page: number) => {
    try {
      const response = await adminService.getCompanies(page, 10);
      setCompanies(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
      setTotalPages(0);
    }
  }, []);

  const loadOffers = useCallback(async (page: number) => {
    try {
      const response = await adminService.getOffers(page, 10);
      setOffers(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading offers:', error);
      setOffers([]);
      setTotalPages(0);
    }
  }, []);

  const loadPostulations = useCallback(async (page: number) => {
    try {
      const response = await adminService.getPostulations(page, 10);
      setPostulations(response.content);
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading postulations:', error);
      setPostulations([]);
      setTotalPages(0);
    }
  }, []);

  // --- CRUD ACTIONS ---

  const createUser = async (user: Partial<User>) => {
    try {
      await adminService.createUser(user);
      await loadUsers(currentPage);
      await loadStats();
      toast.success('Usuario creado con éxito');
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Error al crear el usuario');
      throw error;
    }
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    try {
      await adminService.updateUser(id, user);
      await loadUsers(currentPage);
      await loadStats();
      toast.success('Usuario actualizado');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error al actualizar el usuario');
      throw error;
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers(currentPage);
      await loadStats();
      toast.success('Rol de usuario modificado');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Error al cambiar el rol');
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await adminService.deleteUser(userId);
      await loadUsers(currentPage);
      await loadStats();
      toast.success('Usuario eliminado permanentemente');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('No se pudo eliminar el usuario');
    }
  };

  const deleteCompany = async (companyId: number) => {
    try {
      await adminService.deleteCompany(companyId);
      await loadCompanies(currentPage);
      await loadStats();
      toast.success('Empresa eliminada');
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('No se pudo eliminar la empresa');
    }
  };

  const toggleOfferStatus = async (offerId: number) => {
    try {
      await adminService.toggleOfferStatus(offerId);
      await loadOffers(currentPage);
      await loadStats();
      toast.success('Estado de la oferta actualizado');
    } catch (error) {
      console.error('Error toggling offer:', error);
      toast.error('Error al cambiar el estado de la oferta');
    }
  };

  const deleteOffer = async (offerId: number) => {
    try {
      await adminService.deleteOffer(offerId);
      await loadOffers(currentPage);
      await loadStats();
      toast.success('Oferta eliminada');
    } catch (error) {
      console.error('Error deleting offer:', error);
      toast.error('Error al eliminar la oferta');
    }
  };

  const updatePostulationStatus = async (postulationId: number, estado: boolean) => {
    try {
      await adminService.updatePostulationStatus(postulationId, estado);
      await loadPostulations(currentPage);
      await loadStats();
      toast.success('Postulación actualizada correctamente');
    } catch (error) {
      console.error('Error updating postulation:', error);
      toast.error('Error al cambiar el estado de la postulación');
    }
  };

  return {
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
    updatePostulationStatus
  };
}