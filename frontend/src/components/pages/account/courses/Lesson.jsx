import toast from "react-hot-toast";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { apiDeleteLesson } from "../../../services/api.service";

const Lesson = ({ course, lesson, dispatch }) => {
    const handleDelete = async (id) => {
        if (confirm("Ban co muon xoa khong")) {
            const res = await apiDeleteLesson(id);
            if (res.status) {
                toast.success(res.message);
                dispatch({ type: "DELETE_LESSON", payload: id })
            } else {
                toast.error(res.message)
            }
        }
    }
    return (
        <div className='card shadow px-3 py-2 mb-2'>
            <div className='row'>
                <div className='col-md-8 text-truncate'>
                    {lesson.title}
                </div>
                <div className='col-md-4 d-flex justify-content-end'>
                    {lesson.duration > 0 && <small className='fw-bold text-muted'
                        style={{ marginRight: "10px" }}>{lesson.duration}</small>}
                    {
                        lesson.is_free_preview == "yes" && <span className='badge bg-success'>Preview</span>
                    }

                    <div className='d-flex ms-1'>
                        <Link
                            to={`/account/lesson-edit/${course.id}/${lesson.id}`}
                            className='text-primary me-1'
                        >
                            <BsPencilSquare />
                        </Link>
                        <Link onClick={() => handleDelete(lesson.id)} className='text-danger'>
                            <FaTrashAlt />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Lesson