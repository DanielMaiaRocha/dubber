import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  Languages,
  Globe,
  LanguagesIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    isSeller: false,
    lang: "",
    country: "",
  });

  const { signup, loading } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData, navigate);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mt-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logodubsol.png"
                alt="Logo"
                width={300}
                height={300}
              />
            </div>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSeller"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <div className="flex flex-col ">
                <span className="text-md text-zinc-700 text-sm font-bold">
                  Are you a seller?
                </span>
                <span className="text-xs text-zinc-400">
                  by clicking, you are chosing to be a seller and a card will be
                  showed on main page
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Language
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LanguagesIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="lang"
                  type="text"
                  required
                  value={formData.lang}
                  onChange={(e) =>
                    setFormData({ ...formData,  lang: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="Portuguese"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-700"
              >
                Country
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="country"
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm
									 placeholder-gray-400 focus:outline-none  sm:text-sm"
                  placeholder="Brasil"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent 
							rounded-md shadow-sm text-lg font-semibold text-white bg-[#17a2b8]
							 hover:bg-[#468089] focus:outline-none focus:ring-2 focus:ring-offset-2
							   transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader
                    className="mr-3 h-6 w-6 animate-spin"
                    aria-hidden="true"
                  />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-7 w-7" aria-hidden="true" />
                  Sign up
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium"
            >
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default SignUpPage;
