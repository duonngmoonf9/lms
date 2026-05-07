import { useContext } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { AuthContext } from "../context/Auth";
import { apiLogin } from "../services/api.service";

const Login = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const onSubmit = async (data) => {
        const res = await apiLogin(data);
        if (res.status) {
            const userInfo = {
                token: res.token,
                user: res.user
            }
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            console.log(">>>>>>>>>>>", res.user);

            setUser(res.user);
            toast.success(res.message);
            navigate('/account/dashboard')

        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach(item => {
                setError(item, { message: errors[item][0] })
            })
        }
    }
    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow login'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>Login</h3>
                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="email">Email</label>
                                    <input
                                        {...register('email', {
                                            required: 'Khong duoc de trong'
                                        })}
                                        type="text" className={`form-control ${errors.email && 'is-invalid'}`} placeholder='Email' />
                                    {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}
                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="password">Password</label>
                                    <input
                                        {...register('password', {
                                            required: 'Khong duoc de trong'
                                        })}
                                        type="password" className={`form-control ${errors.password && 'is-invalid'}`}
                                        placeholder='Password' />
                                    {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}

                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <button className='btn btn-primary'>Login</button>
                                    <Link to={`/account/register`} className='text-secondary'>Register Here</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Login