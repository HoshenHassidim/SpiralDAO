"use client"

import Navbar from "../../../components/Navbar"

import {useState} from "react"

import { useForm, SubmitHandler } from "react-hook-form"

type Inputs = {
    example: string
    exampleRequired: string
  }

export default function page() {
  const { register, handleSubmit } = useForm();
  
  const onSubmit = data => {
    console.log(data);
  }

    return (
        <div className="overflow-x-hidden">
          <Navbar />
          <section className="flex flex-col justify-center items-center h-full m-10">
          <h1 className="text-2xl font-bold">Add a problem</h1>
          
          <form className="max-w-lg" onSubmit={handleSubmit(onSubmit)}>

            <input 
              {...register('title')} 
              placeholder="Problem title"
              className="border p-2 w-full mb-4" 
            />

            <textarea 
              {...register('description')}
              placeholder="Describe the problem"
              className="border p-2 w-full mb-4 h-32"
            />

            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Submit Problem  
            </button>
          </form>
          </section>
        </div>
    )
}