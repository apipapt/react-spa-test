import api from './auth.api';

interface ProfileData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  avatarUrl?: string;
  [key: string]: unknown;
}

export const getProfile = async (): Promise<ProfileData> => {
  try {
    const resp = await api.get('/v1/auth/profile');
    return resp.data;
  } catch (err: unknown) {
    // normalize error shape
    const e = err as { response?: { data?: { message?: string } }; message?: string } | undefined;
    if (e?.response?.data?.message) throw new Error(e.response.data.message);
    if (e?.message) throw new Error(e.message);
    throw new Error('Failed to fetch profile');
  }
};

export default { getProfile };
