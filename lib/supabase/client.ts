// Mock Supabase Client for offline simulation workspace
const mockResponse = { data: [] as any[], error: null as any };
const mockQueryBuilder = {
  select: () => {
    const p = Promise.resolve(mockResponse) as any;
    p.order = () => p;
    p.eq = () => p;
    p.limit = () => p;
    return p;
  },
  insert: (...args: any[]) => {
    const p = Promise.resolve(mockResponse) as any;
    p.select = () => Promise.resolve(mockResponse);
    return p;
  },
  update: (...args: any[]) => {
    const p = Promise.resolve(mockResponse) as any;
    p.eq = () => {
      const p2 = Promise.resolve(mockResponse) as any;
      p2.select = () => Promise.resolve(mockResponse);
      return p2;
    };
    return p;
  },
  delete: () => {
    const p = Promise.resolve(mockResponse) as any;
    p.eq = () => Promise.resolve(mockResponse);
    return p;
  },
  order: () => {
    const p = Promise.resolve(mockResponse) as any;
    p.eq = () => p;
    return p;
  },
  eq: () => {
    const p = Promise.resolve(mockResponse) as any;
    return p;
  }
};

export const supabase = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null }, error: null }),
    signUp: async () => ({ data: { user: null }, error: null }),
    signOut: async () => ({ error: null }),
  },
  from: (table: string) => mockQueryBuilder,
};
export default supabase;
