import { create } from "zustand";
import { toast } from "react-hot-toast";

interface QueueStats {
  email: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
  files: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  };
}

interface EmailStatus {
  userId: string;
  emailSent: boolean;
  emailSentAt: string | null;
  jobId: string | null;
  checkedAt: string;
}

interface QueueState {
  // State
  stats: QueueStats | null;
  isLoading: boolean;
  lastUpdated: string | null;
  emailStatuses: Record<string, EmailStatus>;
  
  // Actions
  fetchStats: () => Promise<void>;
  checkEmailStatus: (userId: string) => Promise<EmailStatus | null>;
  sendTestEmail: (userId: string, email: string, username: string) => Promise<boolean>;
  clearStats: () => void;
  
  // Auto refresh
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  isAutoRefreshActive: boolean;
}

// Auto refresh interval reference
let refreshInterval: NodeJS.Timeout | null = null;

export const useQueueStore = create<QueueState>((set, get) => ({
  // Initial state
  stats: null,
  isLoading: false,
  lastUpdated: null,
  emailStatuses: {},
  isAutoRefreshActive: false,

  // Fetch queue stats
  fetchStats: async () => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/stats`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch queue stats');
      }
      
      const stats = await response.json();
      
      set({ 
        stats, 
        isLoading: false,
        lastUpdated: new Date().toISOString()
      });
      
      console.log('📊 Queue stats updated:', stats);
      
    } catch (error) {
      console.error('❌ Failed to fetch queue stats:', error);
      set({ isLoading: false });
      toast.error('Failed to fetch queue statistics');
    }
  },

  // Check specific user's email status
  checkEmailStatus: async (userId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/email-status/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to check email status');
      }
      
      const emailStatus = await response.json();
      
      // Store in state for caching
      set(state => ({
        emailStatuses: {
          ...state.emailStatuses,
          [userId]: emailStatus
        }
      }));
      
      console.log(`📧 Email status for user ${userId}:`, emailStatus);
      return emailStatus;
      
    } catch (error) {
      console.error('❌ Failed to check email status:', error);
      toast.error('Failed to check email status');
      return null;
    }
  },

  // Send test email
  sendTestEmail: async (userId: string, email: string, username: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/queue/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          email,
          username
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send test email');
      }
      
      const result = await response.json();
      
      console.log('🧪 Test email queued:', result);
      toast.success('Test email added to queue!');
      
      // Refresh stats after 2 seconds
      setTimeout(() => {
        get().fetchStats();
      }, 2000);
      
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send test email:', error);
      toast.error('Failed to send test email');
      return false;
    }
  },

  // Clear all stats
  clearStats: () => {
    set({
      stats: null,
      emailStatuses: {},
      lastUpdated: null
    });
  },

  // Start auto refresh (every 5 seconds)
  startAutoRefresh: () => {
    if (refreshInterval) return; // Already running
    
    console.log('🔄 Starting auto refresh...');
    refreshInterval = setInterval(() => {
      get().fetchStats();
    }, 5000);
    
    set({ isAutoRefreshActive: true });
  },

  // Stop auto refresh
  stopAutoRefresh: () => {
    if (refreshInterval) {
      console.log('⏸️ Stopping auto refresh...');
      clearInterval(refreshInterval);
      refreshInterval = null;
    }
    
    set({ isAutoRefreshActive: false });
  }
}));