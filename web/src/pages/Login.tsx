import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../generated/graphql";

interface loginProps {}

export const Login: React.FC = ({}) => {
  let navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("form submited");
        console.log(email, password);
        const response = await login({ variables: { email, password } });
        console.log(response);

        navigate("/");
      }}
    >
      <div>
        <input
          value={email}
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
};
