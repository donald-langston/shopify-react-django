import React from 'react';
import '../Css/Footer.css';

function Footer() {
    const today = new Date();
    const year = today.getFullYear();

    return (
        <footer className="footer">Donald Langston &#169; {year}</footer>
    )
}

export default Footer;