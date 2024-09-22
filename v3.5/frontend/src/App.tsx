import Welcome from "@/features/users/components/Welcome";
import Layout from "@/components/Layout";
import type { PropsWithChildren } from "react";
import Direction from "./components/Direction";

const user = {
  name: "Alfred",
  age: 20,
};

type AppProps = PropsWithChildren;

export default function App(props: AppProps) {
  const { children } = props;
  return (
    <Layout>
      <Welcome user={user} />
      <Direction>{children}</Direction>
    </Layout>
  );
}
