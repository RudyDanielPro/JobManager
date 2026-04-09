import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";
import { useState, useCallback } from 'react';
import { adminService, DashboardStats } from '@/lib/adminService';
import { User, Empresa, OfertaLaboral, Postulacion } from '@/lib/types';

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType["ADD_TOAST"]; toast: ToasterToast; }
  | { type: ActionType["UPDATE_TOAST"]; toast: Partial<ToasterToast>; }
  | { type: ActionType["DISMISS_TOAST"]; toastId?: ToasterToast["id"]; }
  | { type: ActionType["REMOVE_TOAST"]; toastId?: ToasterToast["id"]; };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      };

    case "DISMISS_TOAST": {
      const { toastId } = action;

      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      };
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

type Toast = Omit<ToasterToast, "id">;

function toast({ ...props }: Toast) {
  const id = genId();

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

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

  const createUser = async (user: Partial<User>) => {
    try {
      await adminService.createUser(user);
      await loadUsers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  };

  const updateUser = async (id: number, user: Partial<User>) => {
    try {
      await adminService.updateUser(id, user);
      await loadUsers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const updateUserRole = async (userId: number, newRole: string) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const deleteUser = async (userId: number) => {
    try {
      await adminService.deleteUser(userId);
      await loadUsers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const deleteCompany = async (companyId: number) => {
    try {
      await adminService.deleteCompany(companyId);
      await loadCompanies(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const toggleOfferStatus = async (offerId: number) => {
    try {
      await adminService.toggleOfferStatus(offerId);
      await loadOffers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error toggling offer:', error);
    }
  };

  const deleteOffer = async (offerId: number) => {
    try {
      await adminService.deleteOffer(offerId);
      await loadOffers(currentPage);
      await loadStats();
    } catch (error) {
      console.error('Error deleting offer:', error);
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
  };
}