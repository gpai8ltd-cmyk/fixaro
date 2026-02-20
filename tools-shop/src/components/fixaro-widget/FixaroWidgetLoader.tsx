"use client";

import dynamic from "next/dynamic";

const FixaroWidget = dynamic(
  () => import("@/components/fixaro-widget").then((mod) => mod.FixaroWidget),
  { ssr: false }
);

export function FixaroWidgetLoader() {
  return <FixaroWidget />;
}
