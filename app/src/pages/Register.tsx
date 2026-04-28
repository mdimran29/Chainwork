import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import axios from 'axios';
import { WalletButton } from '../components/WalletButton';
import { useAppKitAccount } from '@reown/appkit/react';
import { useWalletAuth } from '../hooks/useWalletAuth';

const IT_SKILLS = [
  // Core Programming
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust',

  // Frontend
  'React', 'Next.js', 'Vue.js', 'Angular', 'HTML', 'CSS', 'Tailwind CSS',
  'Redux', 'Zustand', 'Framer Motion', 'Three.js', 'WebGL',
  'Responsive Design', 'Progressive Web Apps (PWA)',

  // Backend
  'Node.js', 'Express.js', 'NestJS', 'Fastify',
  'Django', 'Flask', 'Spring Boot',
  'Microservices Architecture', 'Monolith Architecture',

  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin',

  // Databases
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Firebase',
  'Prisma ORM', 'Mongoose', 'Sequelize',

  // APIs & Communication
  'REST API', 'GraphQL', 'gRPC', 'WebSockets', 'Socket.IO',

  // DevOps & Cloud
  'AWS', 'Azure', 'Google Cloud (GCP)',
  'Docker', 'Kubernetes', 'CI/CD Pipelines',
  'GitHub Actions', 'Jenkins', 'Nginx',
  'Serverless Architecture', 'Terraform',

  // Blockchain / Web3
  'Blockchain', 'Solidity', 'Smart Contracts',
  'Web3.js', 'Ethers.js', 'Hardhat', 'Foundry',
  'IPFS', 'The Graph', 'Chainlink',
  'DeFi Protocols', 'Tokenomics',
  'Solana', 'Anchor Framework',

  // Security
  'Cryptography', 'Cybersecurity',
  'OWASP Top 10', 'Smart Contract Auditing',
  'Penetration Testing',

  // AI / Data
  'Machine Learning', 'Deep Learning',
  'Data Science', 'TensorFlow', 'PyTorch',
  'Pandas', 'NumPy', 'OpenCV',
  'LLMs', 'Prompt Engineering', 'AI Agents',

  // System Design
  'System Design', 'Scalability', 'Load Balancing',
  'Caching Strategies', 'Distributed Systems',
  'Event-Driven Architecture', 'Message Queues (Kafka, RabbitMQ)',

  // Testing
  'Jest', 'Mocha', 'Chai', 'Cypress', 'Playwright',
  'Unit Testing', 'Integration Testing', 'E2E Testing',

  // Tools & Workflow
  'Git', 'GitHub', 'GitLab',
  'Linux', 'Bash Scripting',
  'Agile', 'Scrum', 'Project Management',
  'Jira', 'Notion',

  // Design
  'Figma', 'UI/UX', 'Design Systems'
];

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  walletAddress: string;
  role: string;
  skills: string[];
  bio: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isConnected, address } = useAppKitAccount();

  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    walletAddress: '',
    role: 'client',
    skills: [],
    bio: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const [walletMessage, setWalletMessage] = useState('');
  const { authenticateWallet } = useWalletAuth();

  const [skillInput, setSkillInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);

  // Check if wallet is connected
  useEffect(() => {
    if (address && isConnected) {
      const shortAddress = `${address.toString().slice(0, 4)}...${address.toString().slice(-4)}`;
      setWalletMessage(`Wallet Connected: ${shortAddress}`);
      setErrors(prev => ({ ...prev, general: '' }));
    } else {
      setWalletMessage('');
    }
  }, [isConnected, address]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkillInput(value);

    if (value.trim()) {
      const filtered = IT_SKILLS.filter(skill =>
        skill.toLowerCase().includes(value.toLowerCase()) &&
        !formData.skills.includes(skill)
      );
      setSkillSuggestions(filtered.slice(0, 5));
    } else {
      setSkillSuggestions([]);
    }
  };

  const addSkill = (skill: string) => {
    if (!skill.trim()) return;
    const newSkills = [...formData.skills];
    if (!newSkills.includes(skill)) {
      newSkills.push(skill);
      setFormData(prev => ({ ...prev, skills: newSkills }));
    }
    setSkillInput('');
    setSkillSuggestions([]);
    if (errors.skills) {
      setErrors(prev => ({ ...prev, skills: '' }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.role === 'freelancer' && formData.skills.length < 1) {
      newErrors.skills = 'At least one skill is required for freelancers';
    }

    if (address) {
      setFormData(prevData => ({ ...prevData, walletAddress: address.toString() }));
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setApiError('');

    try {
      const response = await api.post('/api/auth/register', {
        ...formData,
        walletAddress: address?.toString(),
      });

      localStorage.setItem('sol_token', response.data.token);
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      window.dispatchEvent(new Event('auth-change'));

      const success = await authenticateWallet();

      if (!success) {
        setApiError('Invalid wallet signature. Please try again.');
        setIsSubmitting(false);
        return;
      }

      navigate('/dashboard', { replace: true });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setApiError(error.response.data.message || 'Registration failed. Please try again.');
      } else {
        setApiError('Registration failed. Please try again.');
      }
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-600">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-secondary-600">
          Connect your wallet and register to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="border-2 border-primary-100 rounded-xl p-6 shadow-xl py-8 px-4 sm:px-10 bg-white">
          {/* Wallet Connection Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Connect Your Solana Wallet
            </h3>
            <p className="text-sm text-secondary-600 mb-4">
              You need to connect your wallet to log in
            </p>

            <div className="flex justify-center mb-4">
              {!isConnected && <WalletButton />}

              {walletMessage && (
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-3 text-accent-700 flex items-center">
                  <svg
                    className="h-5 w-5 mr-2 text-accent-500 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm font-medium">{walletMessage}</span>
                </div>
              )}
            </div>

            <div className="border-t border-secondary-200 pt-6">
              {/* General Error Message */}
              {(apiError || errors.general) && (
                <div
                  className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start"
                  role="alert"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-red-500 shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{apiError || errors.general}</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter your username"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter your email"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`appearance-none block w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                      placeholder="Confirm your password"
                    />
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300
                       rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="client">Client</option>
                      <option value="freelancer">Freelancer</option>
                    </select>
                  </div>
                </div>

                {formData.role === 'freelancer' && (
                  <>
                    <div>
                      <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
                        Skills
                      </label>
                      <div className="mt-1 relative">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {formData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => removeSkill(skill)}
                                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                              >
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </span>
                          ))}
                        </div>
                        <input
                          id="skills"
                          type="text"
                          value={skillInput}
                          onChange={handleSkillInputChange}
                          onKeyDown={handleSkillKeyDown}
                          className={`appearance-none block w-full px-3 py-2 border ${errors.skills ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Type a skill and press Enter or comma to add"
                        />

                        {/* Suggestions Dropdown */}
                        {skillSuggestions.length > 0 && (
                          <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                            {skillSuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() => addSkill(suggestion)}
                                className="text-gray-900 cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}

                        {errors.skills && (
                          <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="bio"
                          name="bio"
                          rows={4}
                          value={formData.bio}
                          onChange={handleChange}
                          className={`appearance-none block w-full px-3 py-2 border ${errors.bio ? 'border-red-300' : 'border-gray-300'
                            } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Tell us about yourself and your expertise"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isSubmitting || !isConnected
                        ? 'bg-indigo-300 cursor-not-allowed'
                        : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                      }`}
                  >
                    {isSubmitting ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Sign in to your account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
