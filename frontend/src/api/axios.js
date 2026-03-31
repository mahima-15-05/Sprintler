import axios from 'axios';

const API = axios.create({
// baseURL:'http://localhost:4000/api'
baseURL:'https://sprintler-backend.onrender.com/api'
});

// add token automatically

API.interceptors.request.use((req)=>{
    const user = JSON.parse(localStorage.getItem("user"));

    if(user?.token){
        req.headers.Authorization =`Bearer ${user.token}`;
    }

    return req;
});

export default API;