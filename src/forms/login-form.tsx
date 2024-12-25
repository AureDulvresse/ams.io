"use client"
import React from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const LoginForm = () => {
   return (
      <div>
         {" "}
         <form className="space-y-3">
            <h1>Connexion</h1>
            <div className="mb-3">
               <Input
                  type="email"
                  name="email"
                  className="p-2 rounded-lg w-full"
                  placeholder="Entrer votre adresse mail"
               />
            </div>
            <div className="mb-3">
               <Input
                  type="password"
                  name="password"
                  className="p-2 rounded-lg w-full"
                  placeholder="Entrer votre mot de passe"
               />
            </div>
            <LoginButton />
         </form>
      </div>
   );
};


const LoginButton = () => {
   const handleSubmit = () => console.log('connexion');
   return <Button onClick={() => handleSubmit}>Connexion</Button>
}

export default LoginForm;
