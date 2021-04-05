import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import Axios from 'axios';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const router = useRouter();

  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!agreement) {
      setErrors({ ...errors, agrement: 'You must agree to T&Cs' });
      return;
    }
    try {
      const { data } = await Axios.post('/auth/register', {
        username,
        email,
        password,
      });
      router.push('/login');
    } catch (error) {
      console.log(error.message);
      setErrors(error.response.data);
    }
  };
  return (
    <div className="flex bg-white">
      <Head>
        <title>Register</title>
      </Head>
      <div
        className="h-screen bg-center bg-cover w-36"
        style={{ backgroundImage: "url('/images/bricks.jpg')" }}
      ></div>
      <div className="flex flex-col justify-center pl-6">
        <div className="w-70">
          <h1 className="mb-2 text-lg font-medium">Sign in</h1>
          <p className="mb-10 text-xs">
            By continuing, you agree to our User Agreement and Privacy Policy
          </p>
          <form onSubmit={submitForm}>
            <div className="mb-6">
              <input
                type="checkbox"
                id="agreement"
                className="mr-1 cursor-pointer"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
              />
              <label htmlFor="agreement" className="text-xs cursor-pointer">
                I agree to get emails about cool stuf on Reddit
              </label>
              <small className="block font-medium text-red-600">
                {errors.agreement}
              </small>
            </div>
            <InputGroup
              className="mb-2"
              type="email"
              value={email}
              setValue={setEmail}
              error={errors.email}
              placeholder="email"
            />
            <InputGroup
              className="mb-2"
              type="text"
              value={username}
              setValue={setUsername}
              error={errors.username}
              placeholder="username"
            />
            <InputGroup
              className="mb-4"
              type="password"
              value={password}
              setValue={setPassword}
              error={errors.password}
              placeholder="password"
            />
            {/* <div className="mb-2">
              <input
                type="email"
                className={classNames(
                  'w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white',
                  {
                    'border-red-500': errors.email,
                  }
                )}
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <small className="font-medium text-red-600">{errors.email}</small>
            </div>

            <div className="mb-2">
              <input
                type="text"
                className="w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 hover:bg-white focus:bg-white"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-2">
              <input
                type="password"
                className="w-full p-3 transition duration-200 border border-gray-300 rounded outline-none bg-gray-50 focus:bg-white hover:bg-white"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div> */}
            <button className="w-full py-2 mb-4 text-xs font-bold text-white bg-blue-500 border-blue-500 rounded upercase">
              Sign up
            </button>
          </form>
          <small>
            Already a redditor?
            <Link href="/login">
              <a className="ml-1 text-blue-500 uppercase">Log in</a>
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
}
