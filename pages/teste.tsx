import React from "react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
// import styles from '@/styles/Home.module.css';
import withAuth from "../hoc/withAuth";
import MainLayout from "../components/layout/MainLayout";

const inter = Inter({ subsets: ["latin"] });

const Home = () => (
  <MainLayout title={"Home"}>
    <Head>
      <title>Create Next App</title>
      <meta name="description" content="Generated by create next app" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <main className={`${inter.className}`}>
    </main>
  </MainLayout>
);

export default withAuth(Home);
