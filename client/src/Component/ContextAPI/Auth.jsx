import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://192.168.101.181:3270/api/auth/login", {
        email,
        password
      });
        setUser(res.data.data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
    };
 return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}