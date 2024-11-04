import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <AppCacheProvider {...pageProps}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </AppCacheProvider>
    </>
  );
}

export default App;
