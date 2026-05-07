import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { apiGetCourse, apiGetMetaData, apiUpdateCourse } from "../../../services/api.service";

const EditCourse = () => {
    const param = useParams();
    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm({
        defaultValues: async () => {
            const res = await apiGetCourse(param.id);
            if (res.status) {
                // dinh nghia gia tri default khi load
                reset({
                    title: res.data.title,
                    category_id: res.data.category_id,
                    language_id: res.data.language_id,
                    level_id: res.data.level_id,
                    description: res.data.description,
                    price: res.data.price,
                    cross_price: res.data.cross_price,
                })
            } else {

            }
        }
    });
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [languages, setLanguage] = useState([]);
    const [levels, setLevel] = useState([]);
    const [loading, setLoading] = useState(false);


    const onSubmit = async (data) => {
        setLoading(true)
        const res = await apiUpdateCourse(param.id, data);
        if (res.status) {
            toast.success(res.message);
            navigate('/account/my-courses');
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach((item) => {
                setError(item, { message: errors[item][0] })
            });
        }
        setLoading(false)
    }

    const getMetaData = async () => {
        const res = await apiGetMetaData();
        if (res.status) {
            setCategories(res.categories);
            setLanguage(res.languages);
            setLevel(res.levels);
        } else {
            toast.error("lay meta data that bai");
        }
    }

    useEffect(() => {
        getMetaData();
    }, [])
    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h3 mb-0 pb-0'>Edit Course</h2>
                                <Link to='/account/my-courses/create' className='btn btn-primary'>Back</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>
                            <div className="row">
                                <div className="col-md-7">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className='card border-0 shadow-lg'>
                                            <div className='card-body p-4'>
                                                <h4 className="h5 border-bottom pb-3 mb-3">Course Detail</h4>
                                                <div className='row'>
                                                    <div className='mb-3'>
                                                        <label htmlFor="title" className='form-label'>Title</label>
                                                        <input type="text" id="title" placeholder='Title' className={`form-control ${errors.title && 'is-invalid'}`}
                                                            {...register('title', {
                                                                required: "Truong nay la bat buoc"
                                                            })}
                                                        />
                                                        {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="category" className='form-label'>Category</label>
                                                        <select
                                                            {...register('category_id', {
                                                                required: "Truong category la bat buoc"
                                                            })}
                                                            className={`form-select ${errors.category_id && 'is-invalid'}`} id="category"
                                                        >
                                                            <option value="">Select a category</option>
                                                            {
                                                                categories && categories.map(item => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        {errors.category_id && <p className='invalid-feedback'>{errors.category_id.message}</p>}

                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="level" className='form-label'>Level</label>
                                                        <select
                                                            {...register('level_id', {
                                                                required: "Truong level la bat buoc"
                                                            })}
                                                            className={`form-select ${errors.level_id && 'is-invalid'}`} id="level"
                                                        >
                                                            <option value="">Select a level</option>
                                                            {
                                                                levels && levels.map(item => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        {errors.level_id && <p className='invalid-feedback'>{errors.level_id.message}</p>}

                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="language" className='form-label'>Language</label>
                                                        <select
                                                            {...register('language_id', {
                                                                required: "Truong language la bat buoc"
                                                            })}
                                                            className={`form-select ${errors.language_id && 'is-invalid'}`} id="language"
                                                        >
                                                            <option value="">Select a language</option>
                                                            {
                                                                languages && languages.map(item => {
                                                                    return (
                                                                        <option key={item.id} value={item.id}>{item.name}</option>
                                                                    )
                                                                })
                                                            }
                                                        </select>
                                                        {errors.language_id && <p className='invalid-feedback'>{errors.language_id.message}</p>}


                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="description" className='form-label'>Description</label>
                                                        <textarea
                                                            {...register('description')}
                                                            name="description" id="description" placeholder="description" className="form-control" rows={5}
                                                        ></textarea>
                                                    </div>
                                                    <h4 className="h5 border-bottom pb-3 mb-3">Pricing</h4>
                                                    <div className='mb-3'>
                                                        <label htmlFor="sell-price" className='form-label'>Sell Price</label>
                                                        <input type="text" placeholder='sell price' className={`form-control ${errors.sell_price && 'is-invalid'}`}
                                                            {...register('price', {
                                                                required: "Truong nay la bat buoc"
                                                            })}
                                                        />
                                                        {errors.price && <p className='invalid-feedback'>{errors.price.message}</p>}
                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="cross-price" className='form-label'>cross Price</label>
                                                        <input type="text" placeholder='cross-price' className={`form-control`}
                                                            {...register('cross_price')}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button
                                                            disabled={loading}
                                                            className='btn btn-primary'
                                                        >
                                                            {loading === false ? 'Update' : 'Please wait...'}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="col-md-5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditCourse