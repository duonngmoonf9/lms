import { useEffect } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { apiUpdateRequirementOfCourse } from '../../../services/api.service'

const UpdateRequirement = (props) => {
    const { showRequirement, handleClose, detailRequirement, requirements, setRequirements } = props

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()

    const onSubmit = async (data) => {
        const res = await apiUpdateRequirementOfCourse(data, detailRequirement.id);
        if (res.status) {
            toast.success(res.message);
            const updateRequirement = requirements.map(item => item.id === res.data.id ? { ...item, text: res.data.text } : item);
            setRequirements(updateRequirement)
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
        if (detailRequirement) {
            reset({
                "text": detailRequirement.text
            })
        }
    }, [detailRequirement]);

    return (
        <Modal size='lg' show={showRequirement} onHide={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Requirement</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-3'>
                        <label htmlFor="text" className='form-label'>Text</label>
                        <input type="text" id="text" placeholder='Requirement' className={`form-control ${errors.text && 'is-invalid'}`}
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

export default UpdateRequirement