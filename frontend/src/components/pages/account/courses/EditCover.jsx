
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import toast from 'react-hot-toast';
import { apiUploadImage } from '../../../services/api.service';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)

const EditCover = ({ course, setCourse }) => {
    const [files, setFiles] = useState([]);
    return (
        <div className='card border-0 shadow-lg mt-3'>
            <div className='card-body p-4'>
                <h4 className="h5 border-bottom pb-3 mb-3">Cover image</h4>
                <FilePond
                    acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                    credits={false}
                    files={files}
                    onupdatefiles={setFiles}
                    allowMultiple={false}
                    maxFiles={1}
                    name="image"

                    // Đoạn text giao diện bạn hỏi nằm ở ngay đây:
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'

                    server={{
                        process: (fieldName, file, metadata, load, error, progress, abort) => {
                            // 1. Đóng gói file vào FormData (Bắt buộc khi gửi file qua Axios)
                            const formData = new FormData();
                            formData.append(fieldName, file, file.name); // fieldName ở đây sẽ tự động lấy từ name="image"

                            const controller = new AbortController();
                            const uploadWithAxios = async () => {
                                try {
                                    // Gọi hàm apiUploadImage bạn đã định nghĩa
                                    const res = await apiUploadImage(course.id, formData, controller.signal);

                                    if (res.status) {
                                        // Báo cho FilePond biết tiến trình đã xong để chuyển UI sang màu xanh
                                        load(res.data?.image_path_small || 'success');

                                        // Xử lý các logic cập nhật UI của bạn
                                        toast.success(res.message);
                                        const updateCourseData = { ...course, image_path_small: res.data.image_path_small };
                                        setCourse(updateCourseData);
                                        setFiles([]);
                                    } else {
                                        // Báo cho FilePond tiến trình thất bại để chuyển UI sang màu đỏ
                                        error(res.message || 'Upload thất bại');
                                        toast.error(res.message);
                                    }
                                } catch (err) {
                                    // Bắt lỗi catch (VD: mất mạng, server sập)
                                    if (err.name === 'CanceledError' || err.message === 'canceled') {
                                        console.log('Tiến trình upload đã bị người dùng hủy');
                                        // Không cần báo toast.error ở đây để tránh làm phiền người dùng
                                    } else {
                                        error('Lỗi hệ thống');
                                        toast.error('Đã có lỗi xảy ra trong quá trình tải lên!');
                                    }
                                }
                            };

                            // 3. Thực thi hàm upload
                            uploadWithAxios();
                            return {
                                abort: () => {
                                    // 1. Ra lệnh cho Axios: "Dừng việc upload luồng mạng lại ngay lập tức!"
                                    controller.abort();
                                    abort();
                                }
                            };

                        },
                    }}
                />
                {
                    course.image_path_small && <img src={course.image_path_small} alt={course.image} className='w-100 rounded' />
                }
            </div>
        </div>
    )
}

export default EditCover