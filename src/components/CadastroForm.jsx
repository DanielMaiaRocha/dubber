import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  Loader,
  LanguagesIcon,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { useUserStore } from "../stores/useUserStore";

const countries = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", 
"Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria",
"Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados",
"Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia",
"Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
"Burkina Faso", "Burundi", "Côte d'Ivoire", "Cabo Verde", "Cambodia",
"Cameroon", "Canada", "Central African Republic", "Chad", "Chile",
"China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia",
"Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica",
"Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea",
"Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
"Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
"Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
"Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland",
"Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya",
"Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
"Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
"Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands",
"Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
"Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
"Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger",
"Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan",
"Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines",
"Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis",
"Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
"Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles",
"Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
"Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka",
"Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Tajikistan", "Tanzania",
"Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
"Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
"United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu",
"Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];

const languages = [ "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", 
"Azerbaijani", "Basque", "Belarusian", "Bengali", "Bosnian",
"Bulgarian", "Burmese", "Catalan", "Cebuano", "Chinese (Simplified)",
"Chinese (Traditional)", "Corsican", "Croatian", "Czech", "Danish",
"Dutch", "English", "Esperanto", "Estonian", "Filipino", "Finnish",
"French", "Frisian", "Galician", "Georgian", "German", "Greek",
"Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew", "Hindi",
"Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish",
"Italian", "Japanese", "Javanese", "Kannada", "Kazakh", "Khmer",
"Kinyarwanda", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin",
"Latvian", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy",
"Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
"Nepali", "Norwegian", "Nyanja", "Odia", "Pashto", "Persian",
"Polish", "Portuguese", "Punjabi", "Romanian", "Russian", "Samoan",
"Scottish Gaelic", "Serbian", "Shona", "Sindhi", "Sinhala", "Slovak",
"Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
"Tajik", "Tamil", "Tatar", "Telugu", "Thai", "Turkish", "Turkmen",
"Ukrainian", "Urdu", "Uyghur", "Uzbek", "Vietnamese", "Welsh", "Xhosa",
"Yiddish", "Yoruba", "Zulu"];

const SignUpPage = () => {
  const navigate = useNavigate();
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
    // Ao finalizar o cadastro, a função signup chama navigate('/login')
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
              <img src="/images/logodubsol.png" alt="Logo" width={300} height={300} />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full name
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  name="email"
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  name="password"
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  name="confirmPassword"
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Seller */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isSeller"
                name="isSeller"
                checked={formData.isSeller}
                onChange={handleInputChange}
                className="form-checkbox h-4 w-4 text-blue-500 border-gray-300 rounded"
              />
              <div className="flex flex-col">
                <span className="text-md text-zinc-700 text-sm font-bold">Are you a seller?</span>
                <span className="text-xs text-zinc-400">
                  by clicking, you are choosing to be a seller and a card will be shown on the main page
                </span>
              </div>
            </div>

            {/* Language */}
            <div>
              <label htmlFor="lang" className="block text-sm font-semibold text-gray-700">
                Language
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LanguagesIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="lang"
                  name="lang"
                  required
                  value={formData.lang}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm appearance-none"
                >
                  <option value="">Select a language</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Country */}
            <div>
              <label htmlFor="country" className="block text-sm font-semibold text-gray-700">
                Country
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 pl-10 bg-white border border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm appearance-none"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-[#17a2b8] hover:bg-[#468089] focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="mr-3 h-6 w-6 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-7 w-7" />
                  Sign up
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium">
              Login here <ArrowRight className="inline h-4 w-4" />
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
