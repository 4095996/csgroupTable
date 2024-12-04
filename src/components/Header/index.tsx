import React from "react";
import Logo from '../../assets/logo.svg'
import { appData } from "../../constants";

export const Header = () => {
    return (
        <div className="headerContainer">
            <div>
                <p className="title">{appData.title}</p>
                <p  className="developer">Frontend-разработчик: {appData.developer}</p>
            </div>
            <Logo />
        </div>

    )
}