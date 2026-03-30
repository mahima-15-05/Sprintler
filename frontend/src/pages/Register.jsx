import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../api/axios'

const Register = () => {
    const [form, setForm] = useState({name:"", email:"", password:""});

    const navigate = useNavigate();

    const handleChange= (e)=>{

        setForm({...form , [e.target.name]: e.target.value});
                console.log(form)


    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register', form);
            alert("Registered Successfully");
            navigate('/');

        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Registeration Failed");
        }
    }


return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-gray-200">
    
    <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-700 w-full max-w-md">
      
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Create Account
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Register
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-4 text-center">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/")}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>

    </div>
  </div>
);
}

export default Register
