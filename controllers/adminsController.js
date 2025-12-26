import { createClient, createAdminClient } from '@/utils/supabase/client';
import crypto from 'crypto';

const supabase = createClient();
const supabaseAdmin = createAdminClient();

export const getAllAdmins = async () => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const createInvitation = async (invitationData) => {
  const { email = null, name, role, created_by } = invitationData;

  // Generate a unique token
  const token = crypto.randomBytes(32).toString('hex');

  // Insert invitation into database
  const { data, error } = await supabase
    .from('invitations')
    .insert({
      token,
      email,
      name,
      role,
      created_by,
      // expires_at defaults to 7 days
    })
    .select()
    .single();

  if (error) throw error;

  // Return invitation data with link
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const invitationLink = `${siteUrl}/admin/signup?secret=${token}`;

  return {
    id: data.id,
    token,
    email,
    name,
    role,
    invitationLink,
    expires_at: data.expires_at
  };
};

export const validateInvitation = async (token) => {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .single();

  if (error || !data) throw new Error('Invalid or expired invitation');
  return data;
};

export const createAdminFromInvitation = async (token, userData) => {
  const invitation = await validateInvitation(token);

  const { email, password, ...adminFields } = userData;

  // Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { full_name: adminFields.name || invitation.name, role: invitation.role }
  });

  if (authError) throw authError;

  // Insert into admins table manually
  const { data: adminData, error: adminError } = await supabase
    .from('admins')
    .insert({
      id: authUser.user.id,
      name: adminFields.name || invitation.name,
      email: email,
      role: invitation.role
    })
    .select()
    .single();

  if (adminError) throw adminError;

  // Mark invitation as used
  await supabase
    .from('invitations')
    .update({ used: true })
    .eq('token', token);

  return adminData;
};

export const getAdminById = async (id) => {
  const { data, error } = await supabase
    .from('admins')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Admin not found');
  return data;
};

export const updateAdmin = async (id, updateData) => {
  // Remove password and status from data as they're not stored in the table
  const { password, status, ...dataToUpdate } = updateData;

  const { data, error } = await supabase
    .from('admins')
    .update(dataToUpdate)
    .eq('id', id)
    .select();

  if (error) throw error;
  if (!data || data.length === 0) throw new Error('Admin not found');
  return data[0];
};

export const deleteAdmin = async (id) => {
  // Delete the user from Supabase Auth, which will cascade delete from admins table
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

  if (error) throw error;
};