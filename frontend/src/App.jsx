import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ChangePass from './components/pages/account/ChangePass'
import CreateCourses from './components/pages/account/courses/CreateCourses'
import EditCourse from './components/pages/account/courses/EditCourse'
import EditLesson from './components/pages/account/courses/EditLesson'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourses from './components/pages/account/WatchCourses'
import Courses from './components/pages/Courses'
import Dashboard from './components/pages/Dashboard'
import Detail from './components/pages/Detail'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import MyLearning from './components/pages/MyLearning'
import RedirectHome from './components/pages/RedirectHome'
import RedirectLogin from './components/pages/RedirectLogin'
import Register from './components/pages/Register'


function App() {
    const [count, setCount] = useState(0)

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/courses' element={<Courses />} />
                    <Route path='/detail' element={<Detail />} />

                    <Route path='/account/login' element={
                        <RedirectHome>
                            <Login />
                        </RedirectHome>
                    } />

                    <Route path='/account/register' element={
                        <RedirectHome>
                            <Register />
                        </RedirectHome>
                    } />

                    <Route path='/account/my-courses' element={<MyCourses />} />
                    <Route path='/account/courses-enrolled' element={<MyLearning />} />
                    <Route path='/account/watch-courses' element={<WatchCourses />} />
                    <Route path='/account/change-password' element={<ChangePass />} />
                    <Route path='/account/dashboard' element={
                        <RedirectLogin>
                            <Dashboard />
                        </RedirectLogin>
                    } />
                    <Route path='/account/courses/create' element={
                        <RedirectLogin>
                            <CreateCourses />
                        </RedirectLogin>
                    } />
                    <Route path='/account/courses/edit/:id' element={
                        <RedirectLogin>
                            <EditCourse />
                        </RedirectLogin>
                    } />
                    <Route path='/account/lesson-edit/:idCourse/:id' element={
                        <RedirectLogin>
                            <EditLesson />
                        </RedirectLogin>
                    } />
                </Routes>
            </BrowserRouter>
            <Toaster
                position="top-center"
                reverseOrder={false}
            />
        </>
    )
}

export default App
