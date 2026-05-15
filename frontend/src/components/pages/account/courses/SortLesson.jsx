import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { MdDragIndicator } from "react-icons/md";
import { apiUpdateSortOrderLesson } from "../../../services/api.service";

const SortLesson = ({ showModalSortLesson, handleCloseModalSortLesson, dataLessons, setDataLessons, dispatch }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(dataLessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setDataLessons(reorderedItems);
        saveOrder(reorderedItems);
    };
    const saveOrder = async (updateSortOrder) => {
        const res = await apiUpdateSortOrderLesson({ dataUpdate: updateSortOrder });
        if (res.status) {

            dispatch({
                type: "UPDATE_LESSON",
                payload: {
                    chapter_id: updateSortOrder[0].chapter_id, // Lấy ID đầu tiên của chapter chứa các lesson này
                    lessons: updateSortOrder // Mảng đã được sắp xếp mới
                }
            })
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }

    }

    return (
        <>
            <Modal size='lg' show={showModalSortLesson} onHide={handleCloseModalSortLesson}>
                <Modal.Header closeButton>
                    <Modal.Title>Sort Lesson</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        dataLessons && dataLessons.map((item, index) => (
                                            <Draggable key={item.id} draggableId={`${item.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >

                                                        <div key={"requirement-" + item.id} className="card shadow-lg mb-1">
                                                            <div className='card-body p-2 d-flex'>
                                                                <div><MdDragIndicator /></div>
                                                                <div className='d-flex justify-content-between w-100'>
                                                                    <div className="ps-2">
                                                                        {item.title}
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
                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default SortLesson