import { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiUpdateOutcomeOfCourse } from '../../../services/api.service'

const UpdateOutcome = (props) => {
    const { showOutcome, handleClose, detailOutcome, outcomes, setOutcomes } = props

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()

    const onSubmit = async (data) => {
        const res = await apiUpdateOutcomeOfCourse(data, detailOutcome.id);
        if (res.status) {
            toast.success(res.message);
            const updateOutcomes = outcomes.map(item => item.id === res.data.id ? { ...item, text: res.data.text } : item);
            setOutcomes(updateOutcomes)
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
        if (detailOutcome) {
            reset({
                "text": detailOutcome.text
            })
        }
    }, [detailOutcome]);

    return (
        <Modal size='lg' show={showOutcome} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Outcomes</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label htmlFor="text" className='form-label'>Text</label>
                        <input type="text" id="text" placeholder='Outcome' className={`form-control ${errors.text && 'is-invalid'}`}
                            {...register('text', {
                                required: "Truong nay la bat buoc"
                            })}
                        />
                        {errors.text && <p className='invalid-feedback'>{errors.text.message}</p>}
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

export default UpdateOutcome