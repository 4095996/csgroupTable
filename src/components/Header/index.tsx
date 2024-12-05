import React from "react";
import logo from '../../assets/logo.svg'
import { appData } from "../../constants";

export const Header = () => {
    return (
        <div className="headerContainer">
            <div>
                <p className="title">{appData.title}</p>
                <p  className="developer">Frontend-разработчик: {appData.developer}</p>
            </div>
            <img src={logo} alt="logo"/>
        </div>

    )
}