import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';


const Login = () => {
    const [form, setForm] = useState({email:"", password:""});
    const navigate = useNavigate();

    const handleChange = (e)=>{
        setForm({...form, [e.target.name]: e.target.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            const data = await API.post("auth/login", form);

            console.log(data);

            localStorage.setItem("user", JSON.stringify(data.data.user));

            navigate("/dashboard");

        }catch(e){
            alert(e.response?.data?.message || "Login failed")
        }
    };
 return (
  <div className="min-h-screen flex items-center justify-center bg-[#0f172a] text-gray-200">
    
    <div className="bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-700 w-full max-w-md">
      
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        Login
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        
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
          Login
        </button>
      </form>

      <p className="text-sm text-gray-400 mt-4 text-center">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-blue-400 cursor-pointer hover:underline"
        >
          Register
        </span>
      </p>

    </div>
  </div>
);
}

export default Login
