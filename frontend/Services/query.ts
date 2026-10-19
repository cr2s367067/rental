import {QueryClient} from '@tanstack/react-query';
export function createQueryClient(){return new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:false,refetchOnMount:'always'},mutations:{retry:false}}});}
export const queryClient=createQueryClient();
export function refreshAll(client:QueryClient=queryClient){return client.invalidateQueries();}
