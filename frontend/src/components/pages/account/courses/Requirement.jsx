import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { apiCreateRequirement, apiDeleteRequirement, apiGetRequirementOfCourse } from "../../../services/api.service";

import UpdateRequirement from "./UpdateRequirement";

const Requirement = () => {
    const [loading, setLoading] = useState(false);
    const [showRequirement, setShowRequirement] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [detailRequirement, setDetailRequirement] = useState();

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()
    const params = useParams();


    const handleClose = () => {
        setShowRequirement(false);

    }
    const handleShow = (item) => {
        setDetailRequirement(item)
        setShowRequirement(true)
    };


    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id };
        const res = await apiCreateRequirement(formData);
        if (res.status) {
            toast.success(res.message);
            const newRequirements = [...requirements, res.data];
            setRequirements(newRequirements);
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

    const getRequirement = async () => {
        const res = await apiGetRequirementOfCourse(params.id);
        if (res.status) {
            setRequirements(res.data);

        } else {
            toast.error("lay requirement that bai");
        }
    }

    const handleDelete = async (id) => {
        if (confirm("Ban co muon xoa khong")) {
            const res = await apiDeleteRequirement(id);
            if (res.status) {
                toast.success(res.message);
                const newRequirement = requirements.filter(item => item.id !== id);
                setRequirements(newRequirement);
                handleClose
            } else {
                toast
            }
        }
    }

    useEffect(() => {
        getRequirement();
    }, [])
    return (
        <>
            <div className='card border-0 shadow-lg mt-3'>
                <div className='card-body p-4'>
                    <h4 className="h5 border-bottom pb-3 mb-3">Requirement</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='row'>
                            <div className='mb-3'>
                                <label htmlFor="text" className='form-label'>Text</label>
                                <input type="text" id="text" placeholder='Requirement' className={`form-control ${errors.text && 'is-invalid'}`}
                                    {...register('text', {
                                        required: "Truong nay la bat buoc"
                                    })}
                                />
                                {errors.text && <p className='invalid-feedback'>{errors.text.message}</p>}
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

                    {/* view requirement */}
                    {requirements && requirements.map(item => {
                        return (
                            <div key={"requirement-" + item.id} className="card shadow-lg mb-1">
                                <div className='card-body p-2 d-flex'>
                                    <div><MdDragIndicator /></div>
                                    <div className='d-flex justify-content-between w-100'>
                                        <div className="ps-2">
                                            {item.text}
                                        </div>
                                        <div className='d-flex'>
                                            <Link onClick={() => handleShow(item)} className='text-primary me-1'>
                                                <BsPencilSquare />
                                            </Link>
                                            <Link onClick={() => handleDelete(item.id)} className='text-danger'>
                                                <FaTrashAlt />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

            <UpdateRequirement
                showRequirement={showRequirement}
                handleClose={handleClose}
                detailRequirement={detailRequirement}
                requirements={requirements}
                setRequirements={setRequirements}
            />
        </>
    )
}

export default Requirement