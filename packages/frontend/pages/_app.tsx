/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import type { AppContext, AppProps } from "next/app";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "shaka-player/dist/controls.css";
import { Header } from "modules/core/components/Header";
import { Global, ThemeProvider } from "@emotion/react";
import { global } from "modules/styling/global";
import { lightTheme } from "modules/styling/themes";
import { Body } from "modules/core/components/Body";
import { getManager, ManagerContext } from "modules/state/manager";
import App from "next/app";
import { ModalOverlay } from "modules/modal/components/ModalOverlay";
import { ScrollLock } from "modules/ui/components/ScrollLock";
import { useObserver } from "mobx-react-lite";
import { PopoverOverlay } from "modules/popover/components/PopoverOverlay";
import { IS_SERVER } from "modules/core/constants";
import { Footer } from "modules/core/components/Footer";

Sentry.init({
  dsn: "https://41ab0b4801094dfd8ecd84eafc947380@o310671.ingest.sentry.io/5701229",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export type CustomAppProps = AppProps & { serialized: any };

export default function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, serialized } = props;

  const manager = getManager(serialized);
  const locked = useObserver(() => manager.stores.modalStore.hasItems);

  return (
    <ManagerContext.Provider value={manager}>
      <ThemeProvider theme={lightTheme}>
        <ScrollLock locked={locked}>
          {(style) => (
            <div style={style}>
              <Global styles={global} />
              <Header />
              <Body>
                <Component {...pageProps} />
              </Body>
              <Footer />
              <ModalOverlay />
              <PopoverOverlay />
            </div>
          )}
        </ScrollLock>
      </ThemeProvider>
    </ManagerContext.Provider>
  );
}

const INCOMING_HEADERS = ["Cookie", "X-Forwarded-For", "X-Forwarded-Proto"].map((x) => x.toLowerCase());

CustomApp.getInitialProps = async (appContext: AppContext): Promise<any> => {
  const manager = getManager();

  const { authStore, networkStore } = manager.stores;
  const { req, res } = appContext.ctx;

  // Propagate headers such as cookies to api calls
  if (IS_SERVER && req && res) {
    for (const key of INCOMING_HEADERS) {
      const value = req.headers[key] as any;
      if (!value) continue;

      networkStore.incomingHeaders[key] = value;
    }

    networkStore.setResponseObject(res);
  }

  if (!manager.didInit) {
    await manager.init();
    await authStore.authenticate();
  }

  appContext.ctx.manager = manager;

  const appProps = await App.getInitialProps(appContext);
  const serialized = manager.serialize();

  return { ...appProps, serialized };
};
