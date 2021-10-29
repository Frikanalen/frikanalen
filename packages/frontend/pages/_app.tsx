/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from "react";
import type { AppContext, AppProps } from "next/app";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import "shaka-player/dist/controls.css";
import { Header } from "modules/core/components/Header";
import { Global } from "@emotion/react";
import { global } from "modules/styling/global";
import { Body } from "modules/core/components/Body";
import { getManager, ManagerContext } from "modules/state/manager";
import App from "next/app";
import { ModalOverlay } from "modules/modal/components/ModalOverlay";
import { ScrollLock } from "modules/ui/components/ScrollLock";
import { PopoverOverlay } from "modules/popover/components/PopoverOverlay";
import { IS_SERVER } from "modules/core/constants";
import { Footer } from "modules/core/components/Footer";
import { enableStaticRendering, observer } from "mobx-react-lite";
import { ThemeContext } from "modules/styling/components/ThemeContext";

// Not a React hook.
// eslint-disable-next-line react-hooks/rules-of-hooks
enableStaticRendering(IS_SERVER);

Sentry.init({
  dsn: "https://41ab0b4801094dfd8ecd84eafc947380@o310671.ingest.sentry.io/5701229",
  integrations: [new Integrations.BrowserTracing()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

export type CustomAppProps = AppProps & { serialized: any };

function CustomApp(props: CustomAppProps) {
  const { Component, pageProps, serialized } = props;

  const [manager] = useState(() => getManager(serialized));
  const locked = manager.stores.modalStore.hasItems;

  return (
    <ManagerContext.Provider value={manager}>
      <ThemeContext>
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
      </ThemeContext>
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

    networkStore.setHTTPObjects(res, req);
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

export default observer(CustomApp);
