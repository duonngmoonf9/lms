import { useContext } from "react"
import FeatureCategories from "../common/FeatureCategories"
import FeatureCourses from "../common/FeatureCourses"
import Hero from "../common/Hero"
import Layout from "../common/Layout"
import { AuthContext } from "../context/Auth"

const Home = () => {
    const { user } = useContext(AuthContext);
    console.log(">>>>>>>>>>>>>>>", user);

    return (
        <Layout>
            <Hero />
            <FeatureCategories />
            <FeatureCourses />
        </Layout>
    )
}

export default Home