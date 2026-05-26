// Mock Supabase Server Client
export const createServerClient = () => {
  return {
    auth: {
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    }),
  };
};
