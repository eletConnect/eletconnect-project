import "./home.css";
import Header from "../../../_components/Header";
import React, { useEffect } from 'react';
import "bootstrap";

export default function Home() {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const escola = JSON.parse(sessionStorage.getItem('escola'));

    console.log("user", user);
    console.log("escola", escola);

 

    return (
        <>
            <Header />
            <section id='section'>
                <div className="box"></div>
            </section>
        </>
    );
}
