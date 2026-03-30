import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const ProjectDetail = () => {
  const { id } = useParams();

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const { data } = await API.get(`/task/${id}`);
      setTasks(data.tasks);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch project members
  const fetchProject = async () => {
    try {
      const { data } = await API.get(`/project/${id}`);
      setMembers(data.project.members);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProject();
    fetchUsers();
  }, []);

  // Filter tasks
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const inProgressTasks = tasks.filter((t) => t.status === "in-progress");
  const doneTasks = tasks.filter((t) => t.status === "done");

  // Update status
  const updateStatus = async (taskId, status) => {
    try {
      await API.put(`/task/update-status`, { taskId, status });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // Handle form
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/task`, {
        ...form,
        projectId: id,
      });

      setForm({ title: "", description: "", assignedTo: "" });
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };


  // Add members 

  const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState("");

const fetchUsers = async () => {
  try {
    const { data } = await API.get("/auth/users");
    setUsers(data);
  } catch (error) {
    console.log(error);
  }
};

const addMember = async (e) => {
  e.preventDefault();

  try {
    await API.put("/project/add-member", {
      projectId: id,
      userId: selectedUser,
      role: "member" // or "admin" if needed
    });

    setSelectedUser("");
    fetchProject();

  } catch (error) {
    alert(error.response?.data?.message);
  }
};

  return (
    <>
    <Navbar/>
   
  <div className="min-h-screen bg-[#0f172a] text-gray-200 p-6">

    {/* HEADER */}
    <h1 className="text-2xl font-bold mb-6 text-white">
      Project Board
    </h1>

<div className="bg-[#1e293b] p-5 rounded-2xl shadow-md mb-6 border border-gray-700">

  <h2 className="text-lg font-semibold mb-4 text-gray-100">
    Add Member
  </h2>

  <form onSubmit={addMember} className="grid md:grid-cols-3 gap-4">

    {/* USER SELECT */}
    <select
      value={selectedUser}
      onChange={(e) => setSelectedUser(e.target.value)}
      className="bg-[#0f172a] border border-gray-600 text-sm text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="">Select User</option>

      {users.map((u) => (
        <option key={u._id} value={u._id}>
          {u.name} ({u.email})
        </option>
      ))}
    </select>

    {/* ROLE SELECT */}
    <select
      onChange={(e) => setRole(e.target.value)}
      className="bg-[#0f172a] border border-gray-600 text-sm text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="member">Member</option>
      <option value="admin">Admin</option>
    </select>

    {/* BUTTON */}
    <button
      type="submit"
      className="bg-blue-600 text-white text-sm font-medium rounded-lg px-4 py-2 hover:bg-blue-700 transition duration-200 shadow-sm"
    >
      Add Member
    </button>

  </form>
</div>


    {/* CREATE TASK */}
    <div className="bg-[#1e293b] p-5 rounded-2xl shadow-md mb-6 border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Create Task
      </h2>

      <form onSubmit={createTask} className="grid md:grid-cols-4 gap-4">
        
        <select
          name="assignedTo"
          value={form.assignedTo}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign User</option>
          {members.map((m) => (
            <option key={m.user._id} value={m.user._id}>
              {m.user.name}
            </option>
          ))}
        </select>
        

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="bg-[#0f172a] border border-gray-600 p-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition"
        >
          Add Task
        </button>
      </form>
    </div>

    {/* KANBAN BOARD */}
    <div className="grid md:grid-cols-3 gap-6">

      {[
        { title: "Todo", tasks: todoTasks },
        { title: "In Progress", tasks: inProgressTasks },
        { title: "Done", tasks: doneTasks },
      ].map((col, idx) => (
        <div
          key={idx}
          className="bg-[#1e293b] p-4 rounded-2xl border border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-white">
            {col.title}
          </h3>

          <div className="space-y-4">
            {col.tasks.map((item) => (
              <div
                key={item._id}
                className="bg-[#0f172a] p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition"
              >
                <h4 className="font-semibold text-white">
                  {item.title}
                </h4>

                <p className="text-gray-400 text-sm">
                  {item.description}
                </p>

                <p className="text-xs mt-2 text-gray-500">
                  Assigned: {item.assignedTo?.name || "Unassigned"}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">

                  {item.status === "todo" && (
                    <button
                      onClick={() =>
                        updateStatus(item._id, "in-progress")
                      }
                      className="bg-yellow-500 px-3 py-1 rounded text-sm hover:bg-yellow-600 text-blue-800"
                    >
                      → In Progress
                    </button>
                  )}

                  {item.status === "in-progress" && (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(item._id, "done")
                        }
                        className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        ✔ Done
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(item._id, "todo")
                        }
                        className="bg-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        ← Todo
                      </button>
                    </>
                  )}

                  {item.status === "done" && (
                    <button
                      onClick={() =>
                        updateStatus(item._id, "in-progress")
                      }
                      className="bg-indigo-600 px-3 py-1 rounded text-sm hover:bg-indigo-700"
                    >
                      ← Back
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
   </>
);
}

export default ProjectDetail;