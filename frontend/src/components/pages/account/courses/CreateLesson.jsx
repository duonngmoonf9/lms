import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Select from "react-select";
import { apiCreateLesson } from "../../../services/api.service";

const CreateLesson = ({ showLesson, handleCloseLesson, chapters, dispatch }) => {
    const { handleSubmit, register, formState: { errors }, setError, reset, watch, control } = useForm({
        defaultValues: {
            status: true,
            title: '',
            chapter_id: ''
        }
    })
    const status = watch('status');


    const onSubmit = async (data) => {
        const formData = {
            ...data,
            status: data.status ? 1 : 0
        }
        const res = await apiCreateLesson(formData);
        if (res.status) {
            console.log(res.data);

            toast.success(res.message);
            reset();
            dispatch({ type: "ADD_LESSON", payload: res.data });
            handleCloseLesson();
        } else {
            toast.error(res.message);
            const errors = res.errors;
            Object.keys(errors).forEach(item => {
                setError(item, { message: errors[item][0] })
            })
        }
    }





    const chapterOptions = chapters ? chapters.map(item => ({
        value: item.id,
        label: item.title
    })) : [];

    return (
        <>
            <Modal size='lg' show={showLesson} onHide={handleCloseLesson}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create lesson</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className='mb-3'>
                            <label htmlFor="chapters" className='form-label'>Chapter</label>
                            {/* <Form.Select
                                aria-label="Default select example"
                                className={`form-control ${errors.chapter_id && 'is-invalid'}`}
                                {...register('chapter_id', {
                                    required: "Truong nay la bat buoc"
                                })}
                            >
                                <option value="">Open this select chapter</option>
                                {
                                    chapters && chapters.map((item, index) => {
                                        return (
                                            <option key={index} value={item.id}>{item.title}</option>
                                        )
                                    })
                                }
                            </Form.Select> */}
                            <Controller
                                name="chapter_id"
                                control={control}
                                rules={{ required: "Trường này là bắt buộc" }}
                                render={({ field: { onChange, value, ref } }) => (
                                    <Select
                                        inputRef={ref}
                                        options={chapterOptions}
                                        placeholder="Open this select chapter..."
                                        // Tìm option tương ứng với giá trị hiện tại để hiển thị
                                        value={chapterOptions.find(c => c.value === value) || null}
                                        // Khi chọn, chỉ lưu lại cái 'value' (tức là item.id) vào form thay vì cả object
                                        onChange={val => onChange(val ? val.value : '')}
                                        isClearable // Thêm nút [x] để xoá lựa chọn nếu cần
                                        className={errors.chapter_id ? 'is-invalid' : ''}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                // Nếu có lỗi thì viền màu đỏ (#dc3545), ngược lại giữ màu mặc định
                                                borderColor: errors.chapter_id ? '#dc3545' : baseStyles.borderColor,
                                                // Giữ viền đỏ ngay cả khi hover chuột vào
                                                '&:hover': {
                                                    borderColor: errors.chapter_id ? '#dc3545' : baseStyles.borderColor
                                                }
                                            })
                                        }}
                                    />
                                )}
                            />
                            {errors.chapter_id && <p className='invalid-feedback'>{errors.chapter_id.message}</p>}

                        </div>
                        <div className='mb-3'>
                            <label htmlFor="title" className='form-label'>Title</label>
                            <input type="text" id="title" placeholder='Lesson' className={`form-control ${errors.title && 'is-invalid'}`}
                                {...register('title', {
                                    required: "Truong nay la bat buoc"
                                })}
                            />
                            {errors.title && <p className='invalid-feedback'>{errors.title.message}</p>}
                        </div>
                        <div className="mb-3">
                            <Form.Check // prettier-ignore
                                type="switch"
                                id="custom-switch"
                                label={status ? 'Active' : 'Block'}
                                {...register('status')}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type='submit'>
                            Create
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default CreateLesson