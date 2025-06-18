import React from "react";
import Homepag from "../components/HomePageComponents/homepage/homepage"
import Niveles from "../components/HomePageComponents/levels/levels";
import TextAbout from "../components/AboutPageComponents/TextAbout/TextAbout";
import Schedules from "../components/SchedulesPageComponents/Schedules";
import Gallery from "../components/Gallery/Gallery";
import transition from "../transition";

const HomePage = () =>{
    return(
        <div>
            <Niveles/>
            <Homepag/>
            <TextAbout/>
            <Schedules/>
            <Gallery/>
        </div>
    )
}

export default transition(HomePage);