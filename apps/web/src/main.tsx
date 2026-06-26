import React from "react";
import ReactDOM from "react-dom/client";
import { I18nextProvider, initReactI18next } from "react-i18next";
import i18n from "i18next";
import { resolvePreferredLocale, resources } from "@liteyuki-shelf/shared";
import { App } from "./App";
import "./styles.css";

const initialLocale = resolvePreferredLocale(
  typeof navigator === "undefined" ? undefined : navigator.languages,
  "zh-CN"
);

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
  </React.StrictMode>
);
