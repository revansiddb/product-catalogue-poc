export const useRouter = () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() });
export const useSearchParams = () => ({ get: jest.fn().mockReturnValue(null) });
export const usePathname = () => '/';
export const useParams = () => ({ id: '1' });
