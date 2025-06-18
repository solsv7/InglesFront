import React from "react";
import transition from "../transition";
import TextAbout from "../components/AboutPageComponents/TextAbout/TextAbout";

const AboutPage = () => {
    return(
        <div>
            <TextAbout />
        </div>
    )
}

export default transition(AboutPage); 