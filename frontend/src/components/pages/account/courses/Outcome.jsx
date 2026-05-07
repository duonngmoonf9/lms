import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { apiCreateOutcome, apiGetOutcomeOfCourse } from "../../../services/api.service";

const Outcome = () => {
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()
    const params = useParams();


    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id };
        const res = await apiCreateOutcome(formData);
        if (res.status) {
            toast.success(res.message);
            reset();
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach(item => {
                setError(item, { message: errors[item][0] })
            })
        }
        setLoading(false);
    }

    const getOutcome = async () => {
        const res = await apiGetOutcomeOfCourse(params.id);
        if (res.status) {
            setOutcomes(res.data);
            console.log(res.data);

        } else {
            toast.error("lay outcome that bai");
        }
    }

    useEffect(() => {
        getOutcome();
    }, [])
    return (
        <div className='card border-0 shadow-lg'>
            <div className='card-body p-4'>
                <h4 className="h5 border-bottom pb-3 mb-3">Outcome</h4>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='row'>
                        <div className='mb-3'>
                            <label htmlFor="text" className='form-label'>Text</label>
                            <input type="text" id="text" placeholder='Outcome' className={`form-control ${errors.text && 'is-invalid'}`}
                                {...register('text', {
                                    required: "Truong nay la bat buoc"
                                })}
                            />
                            {errors.text && <p className='invalid-feedback'>{errors.text.message}</p>}
                        </div>
                        <div>
                            <button
                                disabled={loading}
                                className='btn btn-primary'
                            >
                                {loading === false ? 'Save' : 'Please wait...'}
                            </button>
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}

export default Outcome