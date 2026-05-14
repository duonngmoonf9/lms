import JoditEditor from 'jodit-react';
import { useEffect, useMemo, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoReturnUpBackOutline } from 'react-icons/io5';
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Layout from "../../../common/Layout";
import UserSidebar from "../../../common/UserSidebar";
import { apiGetChapterOfCourse, apiGetCourse, apiGetLesson, apiUpdateLessonOfCourse } from "../../../services/api.service";

const EditLesson = ({ placeholder }) => {
    const [chapters, setChapters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [course, setCourse] = useState([]);
    const [description, setDescription] = useState('');

    const editor = useRef(null);
    const navigate = useNavigate();
    const params = useParams();

    const { handleSubmit, register, formState: { errors }, setError, watch, reset, control } = useForm({
        defaultValues: async () => {
            const res = await apiGetLesson(params.id);
            if (res.status) {
                // dinh nghia gia tri default khi load

                reset({
                    title: res.data.title,
                    chapter_id: res.data.chapter_id,
                    status: res.data.status == 1 ? true : false,
                    duration: res.data.duration,
                    is_free_preview: res.data.is_free_preview == "no" ? false : true,
                })
                setDescription(res.data.description);
            } else {
                toast.error("Lesson không tồn tại hoặc đã bị xóa");
                navigate(`/account/courses/edit/${params.idCourse}`); // hoặc back lại
                return;
            }
        }
    });
    const status = watch('status');
    const isFreePreview = watch('is_free_preview');

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = {
            ...data,
            status: data.status ? 1 : 0,
            description: description
        }
        const res = await apiUpdateLessonOfCourse(formData, params.id);
        if (res.status) {
            toast.success(res.message);
            navigate(`/account/courses/edit/${params.idCourse}`);
        } else {
            toast.error(res.message);
        }
        setLoading(false)


    }

    const getChapter = async () => {
        const res = await apiGetChapterOfCourse(params.idCourse);
        if (res.status) {
            setChapters(res.data)
        } else {
            toast.error("Có lỗi gì đó đã xảy ra không lấy được chapter bên lesson");

        }
    }


    const getCourse = async () => {
        const res = await apiGetCourse(params.idCourse);
        if (res.status) {
            setCourse(res.data);
        } else {
            toast.error(res.message);
        }
    }
    useEffect(() => {
        getCourse();
    }, [])

    useEffect(() => {
        getChapter();
    }, [])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    const chapterOptions = chapters ? chapters.map(item => ({
        value: item.id,
        label: item.title
    })) : [];
    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/docs/,
            placeholder: placeholder || 'Start typings...'
        }),
        [placeholder]
    );

    return (
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="h3 mb-1">Edit Lesson</h2>
                                    <div className="text-muted small">
                                        <span className="text-danger">Course:</span>{" "}
                                        <span className="fw-semibold text-primary">{course.title}</span>
                                    </div>
                                </div>

                                <Link
                                    to={`/account/courses/edit/${params.idCourse}`}
                                    className="btn btn-primary"
                                >
                                    <IoReturnUpBackOutline /> Back
                                </Link>
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
                                                <h4 className="h5 border-bottom pb-3 mb-3">Lesson Detail</h4>
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
                                                        <label htmlFor="chapter" className='form-label'>Chapter</label>
                                                        <Controller
                                                            className={errors.chapter_id ? 'is-invalid' : ''}
                                                            name="chapter_id"
                                                            control={control}
                                                            rules={{ required: "Trường này là bắt buộc" }}
                                                            render={({ field: { onChange, value, ref } }) => (
                                                                <Select
                                                                    inputRef={ref}
                                                                    options={chapterOptions}
                                                                    placeholder="Open this select chapter..."
                                                                    // Tìm option tương ứng với giá trị hiện tại để hiển thị
                                                                    value={chapterOptions.find(c => c.value === value) || null}
                                                                    // Khi chọn, chỉ lưu lại cái 'value' (tức là item.id) vào form thay vì cả object
                                                                    onChange={val => onChange(val ? val.value : '')}
                                                                    isClearable // Thêm nút [x] để xoá lựa chọn nếu cần
                                                                    className={errors.chapter_id ? 'is-invalid' : ''}
                                                                />
                                                            )}
                                                        />
                                                        {errors.chapter_id && <p className='invalid-feedback'>{errors.chapter_id.message}</p>}

                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="duration" className='form-label'>Duration (Mins)</label>
                                                        <input type="number" id="duration" placeholder='Duration' className={`form-control ${errors.duration && 'is-invalid'}`}
                                                            {...register('duration', {
                                                                required: "Truong nay la bat buoc"
                                                            })}
                                                        />
                                                        {errors.duration && <p className='invalid-feedback'>{errors.duration.message}</p>}

                                                    </div>
                                                    <div className='mb-3'>
                                                        <label htmlFor="description" className='form-label'>Description</label>
                                                        <JoditEditor
                                                            ref={editor}
                                                            value={description}
                                                            config={config}
                                                            tabIndex={1} // tabIndex of textarea
                                                            onBlur={newContent => setDescription(newContent)} // preferred to use only this option to update the content for performance reasons
                                                            onChange={newContent => { }}
                                                        />
                                                    </div>
                                                    <div className="mb-3 d-flex">
                                                        <div className="col-md-4">
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label={status ? 'Active' : 'Lock'}
                                                                {...register('status')}
                                                            />
                                                        </div>
                                                        {status === true && <div className="col-md-3">
                                                            <Form.Check
                                                                type="switch"
                                                                id="custom-switch"
                                                                label={isFreePreview ? 'Free Lesson' : 'Not Free'}
                                                                {...register('is_free_preview')}
                                                            />
                                                        </div>}
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
                                <div className="col-md-5">

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default EditLesson