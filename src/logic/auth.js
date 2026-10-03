import usersData from "../data/users.json";

export const loginUser = (email, password) => {
  const user = usersData.users.find(
    (item) => item.email === email && item.password === password
  );

  if (user) {
    localStorage.setItem("sesarengUser", JSON.stringify(user));

    return {
      success: true,
      user,
    };
  }

  return {
    success: false,
    message: "Email atau password salah.",
  };
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("sesarengUser");

  if (!user) return null;

  return JSON.parse(user);
};

export const logoutUser = () => {
  localStorage.removeItem("sesarengUser");
};

export const isAuthenticated = () => {
  return getCurrentUser() !== null;
};