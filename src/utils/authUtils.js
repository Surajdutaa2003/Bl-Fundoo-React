export const isAuthenticated = () => {
    const token = localStorage.getItem("fundoo-token");
    console.log("isAuthenticated, token:", token); // Debug token
    return !!token; // Returns true if token exists, false if not
  };