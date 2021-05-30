import { memo, useMemo } from 'react'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { QueryParamProvider as ContextProvider } from "use-query-params";

import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

const QueryParamProviderComponent = (props: { children?: React.ReactNode }) => {
  const { children, ...rest } = props;
  const router = useRouter();
  const match = router.asPath.match(/[^?]+/);
  const pathname = match ? match[0] : router.asPath;

  const location = useMemo(
    () =>
      typeof window !== "undefined"
        ? window.location
        : ({
          search: router.asPath.replace(/[^?]+/u, ""),
        } as Location),
    [router.asPath]
  );

  const history = useMemo(
    () => ({
      push: ({ search }: Location) =>
        router.push(
          { pathname: router.pathname, query: router.query },
          { search, pathname },
          { shallow: true, scroll: false }
        ),
      replace: ({ search }: Location) => {
        router.replace(
          { pathname: router.pathname, query: router.query },
          { search, pathname },
          { shallow: true, scroll: false }
        );
      },
      location,
    }),
    [pathname, router.pathname, router.query, location.pathname]
  );

  return (
    <ContextProvider {...rest} history={history} location={location}>
      {children}
    </ContextProvider>
  );
};

const QueryParamProvider = memo(QueryParamProviderComponent);


function MyApp({ Component, pageProps }: AppProps) {
  return <QueryParamProvider><Component {...pageProps} /></QueryParamProvider>
}

export default MyApp
