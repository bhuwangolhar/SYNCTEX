import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getOrganization, updateOrganization } from '../services/organization.service';
import type { Organization } from '../services/organization.service';

interface OrganizationContextType {
  organization: Organization | null;
  loading: boolean;
  error: string | null;
  refreshOrganization: (organizationId: string) => Promise<void>;
  updateOrgName: (newName: string) => Promise<void>;
  updateFounderName: (newName: string) => Promise<void>;
  updateContactInfo: (phone: string, email: string) => Promise<void>;
  updateTaxInfo: (gst: string, pan: string, aadhar: string) => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load organization from database on mount
  useEffect(() => {
    const initializeOrganization = async () => {
      try {
        const orgIdFromStorage = localStorage.getItem('organization_id');
        
        if (orgIdFromStorage) {
          setLoading(true);
          const org = await getOrganization(orgIdFromStorage);
          setOrganization(org);
          // Sync to localStorage for quick access
          localStorage.setItem('orgName', org.name);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organization';
        console.error('Error fetching organization on mount:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeOrganization();
  }, []);

  const refreshOrganization = useCallback(async (organizationId: string) => {
    try {
      setLoading(true);
      setError(null);
      const org = await getOrganization(organizationId);
      setOrganization(org);
      // Sync to localStorage for quick access
      localStorage.setItem('orgName', org.name);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch organization';
      setError(errorMessage);
      console.error('Error fetching organization:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrgName = useCallback(async (newName: string) => {
    try {
      setError(null);
      const orgIdFromStorage = localStorage.getItem('organization_id');
      
      if (!orgIdFromStorage) {
        throw new Error('Organization ID not found');
      }

      await updateOrganization(orgIdFromStorage, { name: newName });
      
      // Refresh from database to ensure we have the latest data
      await refreshOrganization(orgIdFromStorage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update organization';
      setError(errorMessage);
      throw err;
    }
  }, [refreshOrganization]);

  const updateFounderName = useCallback(async (newName: string) => {
    try {
      setError(null);
      const orgIdFromStorage = localStorage.getItem('organization_id');
      
      if (!orgIdFromStorage) {
        throw new Error('Organization ID not found');
      }

      await updateOrganization(orgIdFromStorage, { founder_name: newName });
      
      // Refresh from database to ensure we have the latest data
      await refreshOrganization(orgIdFromStorage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update founder name';
      setError(errorMessage);
      throw err;
    }
  }, [refreshOrganization]);

  const updateContactInfo = useCallback(async (phone: string, email: string) => {
    try {
      setError(null);
      const orgIdFromStorage = localStorage.getItem('organization_id');
      
      if (!orgIdFromStorage) {
        throw new Error('Organization ID not found');
      }

      await updateOrganization(orgIdFromStorage, { 
        contactInfo: { phone, email }
      });
      
      // Refresh from database to ensure we have the latest data
      await refreshOrganization(orgIdFromStorage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update contact info';
      setError(errorMessage);
      throw err;
    }
  }, [refreshOrganization]);

  const updateTaxInfo = useCallback(async (gst: string, pan: string, aadhar: string) => {
    try {
      setError(null);
      const orgIdFromStorage = localStorage.getItem('organization_id');
      
      if (!orgIdFromStorage) {
        throw new Error('Organization ID not found');
      }

      await updateOrganization(orgIdFromStorage, { 
        taxInfo: { gst, pan, aadhar }
      });
      
      // Refresh from database to ensure we have the latest data
      await refreshOrganization(orgIdFromStorage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update tax info';
      setError(errorMessage);
      throw err;
    }
  }, [refreshOrganization]);

  return (
    <OrganizationContext.Provider
      value={{
        organization,
        loading,
        error,
        refreshOrganization,
        updateOrgName,
        updateFounderName,
        updateContactInfo,
        updateTaxInfo
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within OrganizationProvider');
  }
  return context;
}
