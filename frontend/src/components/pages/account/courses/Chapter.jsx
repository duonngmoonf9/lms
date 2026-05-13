import { useEffect, useReducer, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { apiCreateChapter, apiDeleteChapter } from "../../../services/api.service";
import Lesson from "./Lesson";
import UpdateChapter from "./UpdateChapter";

const chapterReducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAPTER":
            return action.payload
        case "ADD_CHAPTER":
            return [...state, action.payload]
        case "UPDATE_CHAPTER":
            return state.map(item => {
                if (item.id === action.payload.id) {
                    return action.payload
                }
                return item
            })
        case "DELETE_CHAPTER":
            return state.filter(item => item.id !== action.payload)
        default:
            throw new Error("no action");
    }
}

const Chapter = ({ course, param }) => {
    const [loading, setLoading] = useState(false);
    const [showChapter, setShowChapter] = useState(false);
    const [detailChapter, setDetailChapter] = useState();

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm();

    const [chapters, dispatch] = useReducer(chapterReducer, []);

    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: param.id };
        const res = await apiCreateChapter(formData);
        if (res.status) {
            toast.success(res.message);
            dispatch({ type: "ADD_CHAPTER", payload: res.data })
            reset();
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach(err => {
                setError(err, {
                    message: errors[err][0]
                })
            })
        }
        setLoading(false)
    }

    const handleClose = () => {
        setShowChapter(false);
    }
    const handleShow = (item) => {
        setDetailChapter(item)
        setShowChapter(true)
    };

    useEffect(() => {
        if (course.chapters) {
            dispatch({ type: "SET_CHAPTER", payload: course.chapters })
        }
    }, [course])

    const handleDelete = async (id) => {
        if (confirm("Ban co muon xoa khong")) {
            const res = await apiDeleteChapter(id);
            if (res.status) {
                toast.success(res.message);
                dispatch({ type: "DELETE_CHAPTER", payload: id })
                handleClose()
            } else {
                toast
            }
        }
    }

    return (
        <>
            <div className='card border-0 shadow-lg mt-3'>
                <div className='card-body p-4'>
                    <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                        <h4 className="h5">Chapter</h4>
                        <Link ><IoIosAddCircle /> Lesson
                        </Link>
                    </div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='mb-3'>
                                <label htmlFor="title" className='form-label'>Title</label>
                                <input type="title" id="title" placeholder='Chapter' className={`form-control ${errors.title && 'is-invalid'}`}
                                    {...register('title', {
                                        required: "Truong nay la bat buoc"
                                    })}
                                />
                                {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                            </div>
                            <div className="mb-3">
                                <button
                                    disabled={loading}
                                    className='btn btn-primary'
                                >
                                    {loading === false ? 'Save' : 'Please wait...'}
                                </button>
                            </div>
                        </div>
                    </form>

                    <Accordion >
                        {
                            chapters.map((item, index) => {
                                return (
                                    <Accordion.Item key={index} eventKey={index}>
                                        <Accordion.Header>{item.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <div className="d-flex">
                                                <button onClick={() => handleShow(item)} className="btn btn-primary btn-sm me-1">Update chapter</button>
                                                <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm ">Delete chapter</button>
                                            </div>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>
            <UpdateChapter
                showChapter={showChapter}
                handleClose={handleClose}
                detailChapter={detailChapter}
                dispatch={dispatch}
            />
            <Lesson />
        </>
    )
}

export default Chapter