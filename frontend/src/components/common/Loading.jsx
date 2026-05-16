import Layout from "./Layout"

const Loading = () => {
    return (
        <>
            <Layout>
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading course data...</span>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Loading