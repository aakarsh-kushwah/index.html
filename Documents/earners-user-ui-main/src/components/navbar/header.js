import React from 'react';
import './header.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Userprofile from '../userProfile';
import WithdrwalReq from '../withdrawalRequest';

function Header() {
    return (
        <>
            <Navbar expand={false} className="bg-body-tertiary mb-3">
                <Container fluid>
                    <Navbar.Brand href="/home">
                        <img
                            src='./earnersWaveLogo.png'
                            width={"100rem"}
                            height={"50rem"}
                            alt="Logo"
                        />
                    </Navbar.Brand>

                    {/* WhatsApp icon removed */}

                    <div className='withdrawalsymobl'>
                        <WithdrwalReq />
                    </div>
                    <div>
                        <Userprofile />
                    </div>
                </Container>
            </Navbar>
        </>
    );
}

export default Header;
