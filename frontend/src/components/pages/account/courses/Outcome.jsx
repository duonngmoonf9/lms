import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsPencilSquare } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import { MdDragIndicator } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { apiCreateOutcome, apiDeleteOutcome, apiGetOutcomeOfCourse, apiUpdateSortOrderOutcome } from "../../../services/api.service";

import UpdateOutcome from "./UpdateOutcome";

const Outcome = () => {
    const [loading, setLoading] = useState(false);
    const [showOutcome, setShowOutcome] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const [detailOutcome, setDetailOutcome] = useState();

    const { handleSubmit, register, formState: { errors }, setError, reset } = useForm()
    const params = useParams();


    const handleClose = () => {
        setShowOutcome(false);

    }
    const handleShow = (item) => {
        setDetailOutcome(item)
        setShowOutcome(true)
    };


    const onSubmit = async (data) => {
        setLoading(true)
        const formData = { ...data, course_id: params.id };
        const res = await apiCreateOutcome(formData);
        if (res.status) {
            toast.success(res.message);
            const newOutcomes = [...outcomes, res.data];
            setOutcomes(newOutcomes);
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

        } else {
            toast.error("lay outcome that bai");
        }
    }

    const handleDelete = async (id) => {
        if (confirm("Ban co muon xoa khong")) {
            const res = await apiDeleteOutcome(id);
            if (res.status) {
                toast.success(res.message);
                const newOutcome = outcomes.filter(item => item.id !== id);
                setOutcomes(newOutcome);
                handleClose
            } else {
                toast
            }
        }
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(outcomes);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setOutcomes(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = async (updateSortOrder) => {
        const res = await apiUpdateSortOrderOutcome({ outcomes: updateSortOrder });
        if (res.status) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }

    }

    useEffect(() => {
        getOutcome();
    }, [])
    return (
        <>
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
                    {/* view outcome */}
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        outcomes && outcomes.map((item, index) => (
                                            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >

                                                        <div key={"outcome-" + item.id} className="card shadow-lg mb-1">
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
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </div>
            </div>

            <UpdateOutcome
                showOutcome={showOutcome}
                handleClose={handleClose}
                detailOutcome={detailOutcome}
                outcomes={outcomes}
                setOutcomes={setOutcomes}
            />
        </>
    )
}

export default Outcome