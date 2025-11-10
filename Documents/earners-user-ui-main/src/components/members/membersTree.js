import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../navbar/header';
import './membersTree.css';

const MembersData = () => {
    const [members, setMembers] = useState(null);
    const [memberStack, setMemberStack] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null);
    const treeRef = useRef(null);

    useEffect(() => {
        const retrievedToken = localStorage.getItem('token');
        setToken(retrievedToken);
    }, []);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/user/downline-members`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const data = response.data.data;
                setMembers(data);
                setMemberStack([data]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching members:', error.response ? error.response.data.message : error.message);
                setLoading(false);
            }
        };
        fetchMembers();
    }, [token]);

    const selectedMember = memberStack[memberStack.length - 1];

    const handleClick = (member) => {
        setMemberStack((prevStack) => [...prevStack, member]);
    };

    const handleBack = () => {
        if (memberStack.length > 1) {
            setMemberStack((prevStack) => prevStack.slice(0, -1));
        }
    };

    useEffect(() => {
        if (treeRef.current) {
            treeRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [selectedMember]);

    const countDownlineMembers = (member) => {
        if (!member || !member.children) return 0;
        let count = member.children.length;
        member.children.forEach(child => {
            count += countDownlineMembers(child);
        });
        return count;
    };

    const renderDownlineMembers = (member) => {
        if (!member || !member.children) return null;

        return (
            <ul className="ew-children-list">
                {member.children.map((child) => (
                    <li key={child.id}>
                        <a href="#" onClick={() => handleClick(child)}>
                            <i className="fa fa-user" aria-hidden="true"></i>
                            <span>
                                {child.first_name.slice(0, 7)}
                                <small> ({countDownlineMembers(child)})</small>
                            </span>
                        </a>
                        {child.children && child.children.length > 0 && (
                            <ul className="ew-sub-children-list">
                                {child.children.map((subChild) => (
                                    <li key={subChild.id}>
                                        <a href="#" onClick={() => handleClick(subChild)}>
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                            <span>
                                                {subChild.first_name.slice(0, 7)}
                                                <small> ({countDownlineMembers(subChild)})</small>
                                            </span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        );
    };

    const totalDownline = selectedMember ? countDownlineMembers(selectedMember) : 0;

    return (
        <>
            <Header />
            <div className="ew-tree-container">
                <div className="ew-tree" ref={treeRef}>
                    {loading ? (
                        <p className="ew-loading-text">Loading members...</p>
                    ) : (
                        <>
                            {memberStack.length > 1 && (
                                <button onClick={handleBack} className="ew-back-button">← Back</button>
                            )}
                            <ul className="ew-main-list">
                                <li>
                                    {selectedMember ? (
                                        <a href="#">
                                            <i className="fa fa-user" aria-hidden="true"></i>
                                            <span>
                                                {selectedMember.first_name}
                                                <small> ({totalDownline})</small>
                                            </span>
                                        </a>
                                    ) : (
                                        <p className="ew-empty-state">You don't have any members. Add members using a reference link.</p>
                                    )}
                                    {renderDownlineMembers(selectedMember)}
                                </li>
                            </ul>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default MembersData;