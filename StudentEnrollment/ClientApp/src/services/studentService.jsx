const API_URL = "/api/students";

export const getStudents = async () => {
    const response = await fetch(API_URL, { credentials: "include" });
    return response.json();
};

export const createStudent = async (student) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(student)
    });
    if (!response.ok) throw new Error("Unauthorized or Bad Request");
    return response.json();
};

export const updateStudent = async (id, student) => {
    const response = await fetch(`${API_URL}/${id}`, { 
        method: "PUT", 
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(student)
    });
    if (!response.ok) throw new Error("Unauthorized or Bad Request");
    return response.json();
};

export const deleteStudent = async (id) => {
    const response = await fetch(`${API_URL}/${id}`, { 
        method: "DELETE",
        credentials: "include"
    });
    if (!response.ok) throw new Error("Unauthorized or Bad Request");
    return response.json();
}