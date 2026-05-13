import { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiUpdateChapterOfCourse } from '../../../services/api.service'

const UpdateChapter = (props) => {
    const { showChapter, handleClose, detailChapter, dispatch } = props

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()

    const onSubmit = async (data) => {
        const res = await apiUpdateChapterOfCourse(data, detailChapter.id);
        if (res.status) {
            toast.success(res.message);
            dispatch({ type: "UPDATE_CHAPTER", payload: res.data })
            handleClose();
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach((error) => {
                setError(error, { message: errors[error][0] })
            });
        }
    }

    useEffect(() => {
        if (detailChapter) {
            reset({
                "title": detailChapter.title
            })
        }
    }, [detailChapter]);

    return (
        <Modal size='lg' show={showChapter} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Chapters</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label htmlFor="title" className='form-label'>Text</label>
                        <input type="text" id="title" placeholder='Chapter' className={`form-control ${errors.title && 'is-invalid'}`}
                            {...register('title', {
                                required: "Truong nay la bat buoc"
                            })}
                        />
                        {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type='submit'>
                        Update
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    )
}

export default UpdateChapter