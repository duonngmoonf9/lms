import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useReducer, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegHand } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import { Link } from "react-router-dom";
import { apiCreateChapter, apiDeleteChapter, apiUpdateSortOrderChapter } from "../../../services/api.service";
import CreateLesson from "./CreateLesson";
import Lesson from "./Lesson";
import SortLesson from "./SortLesson";
import UpdateChapter from "./UpdateChapter";

const chapterReducer = (state, action) => {
    switch (action.type) {
        case "SET_CHAPTER":
            return action.payload
        case "ADD_CHAPTER":
            return [...state, action.payload]
        case "UPDATE_CHAPTER":
            return state.map(chapter => {
                if (chapter.id === action.payload.id) {
                    return {
                        ...chapter,       // Giữ lại toàn bộ data cũ (bao gồm mảng lessons)
                        ...action.payload // Cập nhật đè data mới từ API trả về (ví dụ: title mới)
                    }
                }
                return chapter
            })
        case "REORDER_CHAPTERS":
            return action.payload;
        case "DELETE_CHAPTER":
            return state.filter(chapter => chapter.id !== action.payload);



        case "ADD_LESSON":
            return state.map(chapter => {
                if (chapter.id === action.payload.chapter_id) {
                    return {
                        ...chapter,
                        lessons: chapter.lessons ? [...chapter.lessons, action.payload] : [action.payload]
                    }
                }
                return chapter;
            })
        case "UPDATE_LESSON":
            return state.map(chapter => {
                if (chapter.id === action.payload.chapter_id) {
                    return {
                        ...chapter,
                        lessons: action.payload.lessons // Ghi đè lại mảng lessons với thứ tự mới
                    }
                }
                return chapter
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
    const [showModalSortLesson, setShowModalSortLesson] = useState(false);
    const [detailChapter, setDetailChapter] = useState();
    const [dataLessons, setDataLessons] = useState([]);

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

    // modal edit chapter
    const handleClose = () => {
        setShowChapter(false);
    }
    const handleShow = (item) => {
        setDetailChapter(item)
        setShowChapter(true)
    };

    // modal create lesson
    const handleCloseLesson = () => {
        setShowLesson(false);
    }
    const handleShowLesson = () => {
        setShowLesson(true)
    };

    // modal sort lesson
    const handleCloseModalSortLesson = () => {
        setShowModalSortLesson(false);
    }
    const handleShowModalSortLesson = (lessons) => {
        setDataLessons(lessons)
        setShowModalSortLesson(true);
    }


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

    // sort chapter
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chapters);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        dispatch({
            type: "REORDER_CHAPTERS",
            payload: reorderedItems
        });
        saveOrder(reorderedItems);
    };
    const saveOrder = async (updateSortOrder) => {
        const res = await apiUpdateSortOrderChapter({ dataUpdate: updateSortOrder });
        if (res.status) {
            // dispatch({ type: "UPDATE_CHAPTER", payload: updateSortOrder })
            toast.success(res.message);
        } else {
            toast.error(res.message);
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

                    <Accordion>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            // Chỉ lặp mảng chapters 1 lần duy nhất ở đây
                                            chapters.map((item, index) => (
                                                <Draggable key={item.id} draggableId={`${item.id}`} index={index}>
                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-3 py-2 bg-white shadow-lg rounded d-flex align-items-center"
                                                        >
                                                            <div className="me-2"><FaRegHand /></div>
                                                            {/* Mỗi item drag được sẽ chứa 1 Accordion.Item tương ứng */}
                                                            <Accordion.Item eventKey={index} className="w-100">
                                                                <Accordion.Header>
                                                                    <span className="text-truncate d-block">
                                                                        {item.title}
                                                                    </span>
                                                                </Accordion.Header>

                                                                <Accordion.Body>
                                                                    <div className='row'>
                                                                        {item.lessons?.length > 0 &&
                                                                            <div className='col-md-12'>
                                                                                <div className="d-flex justify-content-between mb-2 mt-4">
                                                                                    <h4 className="h5">Lessons</h4>
                                                                                    <Link className="h6" onClick={() => handleShowModalSortLesson(item.lessons)}>
                                                                                        <strong>Reorder Lessons</strong>
                                                                                    </Link>
                                                                                </div>
                                                                            </div>
                                                                        }

                                                                        <div className="col-md-12">
                                                                            {
                                                                                // Đổi tên biến index của lesson thành lessonIndex để không bị trùng với index của chapter
                                                                                item.lessons && item.lessons.map((lesson, lessonIndex) => (
                                                                                    <Lesson
                                                                                        key={lessonIndex}
                                                                                        lesson={lesson}
                                                                                        course={course}
                                                                                        dispatch={dispatch}
                                                                                    />
                                                                                ))
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
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        }
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
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
            <SortLesson
                showModalSortLesson={showModalSortLesson}
                handleCloseModalSortLesson={handleCloseModalSortLesson}
                dataLessons={dataLessons}
                setDataLessons={setDataLessons}
                dispatch={dispatch}
            />
        </>
    )
}

export default Chapter