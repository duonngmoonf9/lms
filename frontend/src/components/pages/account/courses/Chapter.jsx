import { useEffect, useReducer, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { apiCreateChapter, apiDeleteChapter } from "../../../services/api.service";
import CreateLesson from "./CreateLesson";
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
            return state.filter(item => item.id !== action.payload);

        case "ADD_LESSON":
            return state.map(chapter => {
                // Tìm đúng chapter_id của lesson vừa tạo
                if (chapter.id === action.payload.chapter_id) {
                    return {
                        ...chapter,
                        // Thêm lesson mới vào mảng lessons hiện tại (nếu chưa có lessons thì tạo mảng mới)
                        lessons: chapter.lessons ? [...chapter.lessons, action.payload] : [action.payload]
                    }
                }
                return chapter;
            })
        case "DELETE_LESSON":
            return state.map(chapter => {
                return {
                    ...chapter,
                    lessons: chapter.lessons ? chapter.lessons.filter(lesson => lesson.id !== action.payload) : []
                }
            })
        default:
            throw new Error("no action");
    }
}

const Chapter = ({ course, param }) => {
    const [loading, setLoading] = useState(false);
    const [showChapter, setShowChapter] = useState(false);
    const [showLesson, setShowLesson] = useState(false);
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


    const handleCloseLesson = () => {
        setShowLesson(false);
    }
    const handleShowLesson = () => {
        setShowLesson(true)
    };

    useEffect(() => {
        if (course.chapters) {
            dispatch({ type: "SET_CHAPTER", payload: course.chapters })
        }
    }, [course?.chapters])

    const handleDelete = async (id) => {
        if (confirm("Ban co muon xoa khong")) {
            const res = await apiDeleteChapter(id);
            if (res.status) {
                toast.success(res.message);
                dispatch({ type: "DELETE_CHAPTER", payload: id })
                handleClose()
            } else {
                toast.error(res.message)
            }
        }
    }

    return (
        <>
            <div className='card border-0 shadow-lg mt-3'>
                <div className='card-body p-4'>
                    <div className="d-flex justify-content-between border-bottom pb-3 mb-3">
                        <h4 className="h5">Chapter</h4>
                        <Link onClick={() => handleShowLesson()}><IoIosAddCircle size={20} /> <strong>Lesson</strong>
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
                                        <Accordion.Header>
                                            <span className="text-truncate d-block">
                                                {item.title}
                                            </span>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className='row'>
                                                {item.lessons &&
                                                    <div className='col-md-12'>
                                                        <div className="d-flex justify-content-between mb-2 mt-4">
                                                            <h4 className="h5">Lessons</h4>
                                                            <a className="h6" href="#" data-discover="true">
                                                                <strong>Reorder Lessons</strong>
                                                            </a>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="col-md-12">
                                                    {
                                                        item.lessons && item.lessons.map((lesson, index) => {
                                                            return (
                                                                <Lesson
                                                                    key={index}
                                                                    lesson={lesson}
                                                                    course={course}
                                                                    dispatch={dispatch}
                                                                />
                                                            )
                                                        })
                                                    }
                                                </div>
                                                <div className="col-md-12 mt-3">
                                                    <div className="d-flex">
                                                        <button onClick={() => handleShow(item)} className="btn btn-primary btn-sm me-1">Update chapter</button>
                                                        <button onClick={() => handleDelete(item.id)} className="btn btn-danger btn-sm ">Delete chapter</button>
                                                    </div>
                                                </div>
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
            <CreateLesson
                showLesson={showLesson}
                handleCloseLesson={handleCloseLesson}
                chapters={chapters}
                dispatch={dispatch}
            />
        </>
    )
}

export default Chapter