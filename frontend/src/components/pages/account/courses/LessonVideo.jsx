import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'filepond/dist/filepond.min.css';
import { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import toast from 'react-hot-toast';
import ReactPlayer from 'react-player';
import { apiUploadVideo } from '../../../services/api.service';
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)
const LessonVideo = ({ lesson, setLesson }) => {
    const [files, setFiles] = useState([]);
    return (
        <>
            <div className='card border-0 shadow-lg'>
                <div className='card-body p-4'>
                    <h4 className="h5 border-bottom pb-3 mb-3">Lesson Video</h4>
                    <FilePond
                        acceptedFileTypes={['video/mp4']}
                        credits={false}
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={1}
                        name="video"

                        // Đoạn text giao diện bạn hỏi nằm ở ngay đây:
                        labelIdle='Drag & Drop your files or <span className="filepond--label-action">Browse</span>'

                        server={{
                            process: (fieldName, file, metadata, load, error, progress, abort) => {
                                // 1. Đóng gói file vào FormData (Bắt buộc khi gửi file qua Axios)
                                const formData = new FormData();
                                formData.append(fieldName, file, file.name); // fieldName ở đây sẽ tự động lấy từ name="image"

                                const controller = new AbortController();
                                const uploadWithAxios = async () => {
                                    try {
                                        // Gọi hàm apiUploadImage bạn đã định nghĩa
                                        const res = await apiUploadVideo(lesson.id, formData, controller.signal);

                                        if (res.status) {
                                            // Báo cho FilePond biết tiến trình đã xong để chuyển UI sang màu xanh
                                            load(res.data?.video_path_url || 'success');

                                            // Xử lý các logic cập nhật UI của bạn
                                            toast.success(res.message);
                                            const updateCourseData = { ...lesson, video_path_url: res.data.video_path_url };
                                            setLesson(updateCourseData);
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
                    <ReactPlayer
                        width="100%"
                        // height="100%"
                        controls
                        src={lesson.video_path_url} />
                </div>
            </div>
        </>
    )
}

export default LessonVideo