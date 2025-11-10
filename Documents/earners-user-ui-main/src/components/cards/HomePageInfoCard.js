import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaUsers, FaShoppingCart, FaWallet, FaMedal } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './HomePageInfoCard.css';

const InfoCard = () => {
    const navigate = useNavigate();
    const [level, setLevel] = useState('silver');

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (storedProfile && storedProfile.level) {
            const userLevel = storedProfile.level;
            if (userLevel === 1) setLevel('silver');
            else if (userLevel === 2) setLevel('gold');
            else if (userLevel === 3) setLevel('platinum');
        }
    }, []);

    const getLevelColor = () => {
        switch (level.toLowerCase()) {
            case 'gold': return '#ffd700';
            case 'silver': return '#c0c0c0';
            case 'platinum': return '#e5e4e2';
            default: return '#c0c0c0';
        }
    };

    return (
        <Card className="p-3 mb-4 hpi-card-wrapper" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-1">
                {/* ↓↓↓ 'flex-nowrap' is ADDED BACK to force a single row on all devices ↓↓↓ */}
                <Row className="flex-nowrap align-items-center hpi-content-row">
                    {/* Members */}
                    <Col className="hpi-item" onClick={() => navigate('/members-data')}>
                        <div className="text-center">
                            <FaUsers size={30} color="#4caf50" />
                            <p className="mt-2 mb-0 hpi-item-text">Members</p>
                        </div>
                    </Col>
                    {/* Orders */}
                    <Col className="hpi-item" onClick={() => navigate('/order-history')}>
                        <div className="text-center">
                            <FaShoppingCart size={30} color="#2196f3" />
                            <p className="mt-2 mb-0 hpi-item-text">Orders</p>
                        </div>
                    </Col>
                    {/* Wallet */}
                    <Col className="hpi-item" onClick={() => navigate('/wallet')}>
                        <div className="text-center">
                            <FaWallet size={30} color="#ff9800" />
                            <p className="mt-2 mb-0 hpi-item-text">Wallet</p>
                        </div>
                    </Col>
                    {/* Silver/Level */}
                    <Col className="hpi-item" onClick={() => navigate('/business-plan')}>
                        <div className="text-center">
                            <FaMedal size={30} color={getLevelColor()} />
                            <p className="mt-2 mb-0 hpi-level-text hpi-item-text">{level.charAt(0).toUpperCase() + level.slice(1)}</p>
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default InfoCard;