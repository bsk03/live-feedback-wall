import { Panel } from "@/components/panel/Panel";
import { Suspense } from "react";

export default async function PanelPage() {
  return (
    <Suspense>
      <Panel />
    </Suspense>
  );
}
