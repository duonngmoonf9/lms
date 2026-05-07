import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../../common/Layout'
import UserSidebar from '../../../common/UserSidebar'
import { apiCreateCourse } from '../../../services/api.service'

const CreateCourses = () => {
    const { handleSubmit, register, formState: { errors }, setError } = useForm();
    const navigate = useNavigate();
    const onSubmit = async (data) => {
        const res = await apiCreateCourse(data);
        if (res.status) {
            toast.success(res.message);
            navigate('/account/courses/edit/' + res.data.id);
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach((item) => {
                setError(item, { message: errors[item][0] })
            });
        }
    }

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h3 mb-0 pb-0'>Create Course</h2>
                                <Link to='/account/my-courses/create' className='btn btn-primary'>Back</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div className='card border-0 shadow-lg'>
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='mb-3'>
                                                <label htmlFor="" className='form-label'>Title</label>
                                                <input type="text" placeholder='Title' className={`form-control ${errors.title && 'is-invalid'}`}
                                                    {...register('title', {
                                                        required: "Truong nay la bat buoc"
                                                    })}
                                                />
                                                {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                                            </div>
                                            <div>
                                                <button className='btn btn-primary'>Create</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default CreateCourses