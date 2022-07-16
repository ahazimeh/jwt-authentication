import React from "react";
import { useUsersQuery } from "../generated/graphql";

interface homeProps {}

export const Home: React.FC<homeProps> = ({}) => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" }); // not read from cache but make a request every time
  if (!data) return <div>loading...</div>;
  return (
    <div>
      <div>users:</div>
      <ul>
        {data.users.map((x) => {
          return (
            <li key={x.id}>
              {x.email}, {x.id}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
