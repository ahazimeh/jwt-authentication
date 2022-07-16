import { useQuery } from "@apollo/react-hooks";
import { gql } from "@apollo/client";
import React from "react";
import { useHelloQuery } from "./generated/graphql";

function App() {
  // const { data, loading } = useQuery(gql`
  //   {
  //     hello
  //   }
  // `);
  const { data, loading } = useHelloQuery();
  if (loading) return <div>loading...</div>;
  return <div>{data?.hello}</div>;
}

export default App;
