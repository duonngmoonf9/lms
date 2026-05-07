import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../common/Layout";
import { apiRegister } from "../services/api.service";

const Register = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        // Handle form submission
        const res = await apiRegister(data);

        if (res.status) {
            toast.success(res.message, {
                duration: 2000,
            });
            navigate('/account/login')

        } else {
            toast.error(res.message)
            const errors = res.errors;
            Object.keys(errors).forEach(item => {
                setError(item, { message: errors[item][0] });
            })
        }
    }
    return (
        <Layout>
            <div className='container py-5 mt-5'>
                <div className='d-flex align-items-center justify-content-center'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='card border-0 shadow register'>
                            <div className='card-body p-4'>
                                <h3 className='border-bottom pb-3 mb-3'>Register</h3>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="name">Name</label>
                                    <input
                                        {...register('name',
                                            {
                                                required: "Truong nay la bat buoc"
                                            }
                                        )}
                                        type="text"
                                        className={`form-control ${errors.name && 'is-invalid'}`}
                                        placeholder='Name' />
                                    {errors.name && <p className="invalid-feedback">{errors.name.message}</p>}
                                </div>


                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="email">Email</label>
                                    <input
                                        {...register('email',
                                            {
                                                required: "Truong nay la bat buoc",
                                                pattern: {
                                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                    message: "Khong dung dinh dang email"
                                                }
                                            }
                                        )}
                                        type="text"
                                        className={`form-control ${errors.email && 'is-invalid'}`}
                                        placeholder='Email' />
                                    {errors.email && <p className="invalid-feedback">{errors.email.message}</p>}


                                </div>

                                <div className='mb-3'>
                                    <label className='form-label' htmlFor="password">Password</label>
                                    <input
                                        {...register('password',
                                            {
                                                required: "Truong nay la bat buoc"
                                            }
                                        )}
                                        type="password"
                                        className={`form-control ${errors.password && 'is-invalid'}`}
                                        placeholder='Password' />
                                    {errors.password && <p className="invalid-feedback">{errors.password.message}</p>}

                                </div>

                                <div>
                                    <button className='btn btn-primary w-100'>Register</button>
                                </div>

                                <div className='d-flex justify-content-center py-3'>
                                    Already have account? &nbsp;<Link className='text-secondary' to={`/account/login`}> Login</Link>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    )
}

export default Register