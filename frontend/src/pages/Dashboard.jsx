import React, { useEffect } from "react";
import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [project, setProject] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  //Fetch projects
  const fetchProjects = async () => {
    try {
      const { data } = await API.get("/project");
      console.log(data.projects);

      setProject(data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // create project
  const createProjectHandler = async (e) => {
    e.preventDefault();
    try {
      await API.post("/project", form);
      setForm({ name: "", description: "" });

      alert("Project created successfully");
      fetchProjects();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // call funtion to fetch projects
  useEffect(() => {
    fetchProjects();
  }, []);
return (
  <>
  <Navbar />
  <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6">

    {/* HEADER */}
    <h1 className="text-2xl font-bold text-white mb-6">
      Dashboard
    </h1>

    {/* CREATE PROJECT */}
    <div className="bg-[#1e293b] p-6 rounded-2xl border border-gray-700 shadow-md mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">
        Create Project
      </h2>

      <form
        onSubmit={createProjectHandler}
        className="grid md:grid-cols-3 gap-4"
      >
        <input
          name="name"
          type="text"
          placeholder="Project Name"
          value={form.name}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        ></textarea>

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-3 hover:bg-blue-700 transition"
        >
          Create
        </button>
      </form>
    </div>

    {/* PROJECT LIST */}
    <h3 className="text-xl font-semibold text-white mb-4">
      Your Projects
    </h3>

    <div className="grid md:grid-cols-3 gap-6">
      {project.map((item) => (
        <div
          key={item._id}
          onClick={() => navigate(`/project/${item._id}`)}
          className="bg-[#1e293b] p-5 rounded-2xl border border-gray-700 cursor-pointer hover:border-blue-500 hover:shadow-lg transition"
        >
          <h4 className="text-lg font-semibold text-white">
            {item.name}
          </h4>

          <p className="text-gray-400 text-sm mt-2">
            {item.description}
          </p>
        </div>
      ))}
    </div>

  </div>
  </>
);
};

export default Dashboard;
