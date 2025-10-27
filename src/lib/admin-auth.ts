import { supabase } from "@/integrations/supabase/client";

export const isAdminUser = async (): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return false;
    }

    // Check if user is admin by email (you can modify this logic)
    const adminEmails = ['motivationinfinity26@gmail.com', 'your-admin-email@domain.com']; // Add your admin emails
    return adminEmails.includes(user.email?.toLowerCase() || '');
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const requireAdmin = async (): Promise<boolean> => {
  const isAdmin = await isAdminUser();
  if (!isAdmin) {
    // Redirect to home or login page if not admin
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
    return false;
  }
  return true;
};