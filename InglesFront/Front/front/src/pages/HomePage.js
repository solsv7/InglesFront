import React from "react";
import Header from "../components/Header/Header";
import Homepag from "../components/homepage/homepage";
import Niveles from "../components/levels/levels";
import Footer from "../components/footer/footer";
import Home from "../components/Home/homeComponent";

const HomePage = () =>{
    return(
        <div>
            <Header />
            <Homepag />
            <Niveles />
            <Footer />
        </div>
    )
}

export default HomePage;