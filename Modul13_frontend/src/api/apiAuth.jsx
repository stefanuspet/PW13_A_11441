import useAxios from ".";
const SignUp = async (data) => {
    try {
        const response = await useAxios.post("/register", data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
const SignIn = async (data) => {
    try {
        const response = await useAxios.post("/login", data);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// get user by id
const GetUserById = async (id) => {
    try {
        const response = await useAxios.get(`/review/user`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data;
    }
};
export { SignUp, SignIn, GetUserById };