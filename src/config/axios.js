import axios from "axios";

export default axios.create({
    baseURL: 'https://rentflow-wrrf.onrender.com' || "http://localhost:5555"
})