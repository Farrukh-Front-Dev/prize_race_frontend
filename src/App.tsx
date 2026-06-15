/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */
import { Providers } from "./app/providers";
import { AppShell } from "./app/AppShell";

export default function App() {
  return (
    <Providers>
      <AppShell />
    </Providers>
  );
}
