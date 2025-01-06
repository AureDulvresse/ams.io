'use client';

import { PropsWithChildren, useState } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { generateQueryClient } from '@/src/lib/react-query';

export default function ReactQueryProvider({ children }: PropsWithChildren) {
   const [queryClient] = useState(() => generateQueryClient());

   return (
      <QueryClientProvider client={queryClient}>
         {children}
         {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
   );
}