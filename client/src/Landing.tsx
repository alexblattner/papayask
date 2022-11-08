import React, { useContext, useState, useEffect } from "react";
const Landing = () => {
    return (
      <div id="landing">
        <div className="block">
            <div className="left">
                <h1>Get answers from leading experts</h1>
                <form id="search-form">
                    <input type="text" placeholder='Try "SEO", "Entrepreneurship" or "Hosting'/>
                    <input type="submit" value="Search"/>
                </form>

            </div>
            <div className="right"></div>
        </div>
        <div className="block">
            <div className="left"></div>
            <div className="right"></div>
        </div>
      </div>
    );
};

export default Landing;