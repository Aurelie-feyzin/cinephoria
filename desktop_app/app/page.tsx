"use client"

import Image from "next/image";
import {SubmitHandler, useForm} from "react-hook-form";
import React, {useState} from "react";
import AlertError from "@/app/ui/alert/AlertError";
import {customMaxLength, REQUIRED} from "@/app/lib/validator_tools";
import InputField from "@/app/ui/form/InputField";
import ButtonSubmit from "@/app/ui/button/ButtonSubmit";
import {fetchGetToken} from "@/app/api/auth";
import {useUser} from "@/app/context/UserContext";

export type LoginInput = {
  username: string;
  password: string;
}
export default function Home() {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<LoginInput>();
  const [loginKo, setLoginKo] = useState(false);
  const [messageKo, setMessageKo] = useState('');
  const {login} = useUser();

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      setMessageKo('');
      setLoginKo(false);
      const response = await fetchGetToken(data);
      if (!response.ok) {
        const badResponse = await response.json();
        if (badResponse.code === 401 && badResponse.message === 'Invalid credentials.') {
          setMessageKo('Identification impossible : émail et/ou mot de passe incorrect.');
        } else {
          setMessageKo('Une erreur c\'est produite pendant la récupération de votre profil.)');
        }
        setLoginKo(true);
        return;
      }
      const tokenResponse = await response.json();
      login(tokenResponse.token);
    } catch (error) {
      console.log(error);
      setLoginKo(true);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center bg-secondary justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start bg-secondary">
        <Image
          className="dark:invert items-center mx-auto"
          src="/logo_cinephoria.png"
          alt="Logo cinephoria"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl">Bienvenue sur l&#39;application bureautique</h1>
          <div className="mb-4 mx-auto rounded-lg bg-black shadow-md w-full p-6">
            <AlertError visible={loginKo}
                        titleMessage='Erreur pendant la récupération du profil'
                        message={messageKo}
            />
          <form onSubmit={handleSubmit(onSubmit)} className="mx-auto bg-black">
            <h2 className="text-2xl font-bold mb-4 text-center text-secondary">Se connecter</h2>
            <InputField register={register("username", {...REQUIRED, ...customMaxLength(180)})}
                        type='email'
                        name='username'
                        label='Email'
                        error={errors.username?.message}
            />
            <InputField register={register("password", {...REQUIRED})}
                        type='password'
                        name='password'
                        label='Mot de passe'
                        error={errors.password?.message}
            />
{/*
            <LinkForgotPasswordForm setFormVisible={setFormVisible} />
*/}
            <ButtonSubmit label="Se connecter" />
          </form>
          </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <div className="w-full p-4 text-center text-primary">
          © 2024 Copyright for ECF Bachelor CDA Symfony
        </div>
      </footer>
    </div>
  );
}
