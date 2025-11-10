import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Header from '../navbar/header';
import './withdrawalHistory.css';
import { FaCalendarAlt, FaHistory, FaSyncAlt, FaExclamationCircle } from 'react-icons/fa';

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [totalIncome, setTotalIncome] = useState(0);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const calculateIncome = useCallback((transactionsData) => {
        // Calculate total income from all transactions
        const total = transactionsData.reduce((total, transaction) => total + transaction.amount, 0);
        setTotalIncome(total);

        // Calculate income for the currently selected month and year
        const monthly = transactionsData
            .filter(transaction => new Date(transaction.request_date).getMonth() === selectedMonth && new Date(transaction.request_date).getFullYear() === selectedYear)
            .reduce((total, transaction) => total + transaction.amount, 0);
        setMonthlyIncome(monthly);
    }, [selectedMonth, selectedYear]);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Authentication token not found. Please log in.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${process.env.REACT_APP_PROTOCOL}/api/withdrawal/user-withdrawal-history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (response.data && response.data.data) {
                    const transactionsData = response.data.data;
                    setTransactions(transactionsData);
                    calculateIncome(transactionsData);
                } else {
                    setTransactions([]); // Clear previous data if none found
                    setError('No transactions found.');
                }
            } catch (error) {
                console.error('Error fetching transactions:', error);
                setError('Failed to fetch transactions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [calculateIncome]); // Reruns when calculateIncome is stable

    // Recalculate monthly income when filters change
    useEffect(() => {
        calculateIncome(transactions);
    }, [selectedMonth, selectedYear, transactions, calculateIncome]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value, 10));
    };

    const handleYearChange = (e) => {
        setSelectedYear(parseInt(e.target.value, 10));
    };

    // --- UPDATED LOGIC FOR YEARS ---
    // 1. Get the current year.
    // 2. Get all unique years from the transactions.
    // 3. Combine them, remove duplicates with a Set, and sort from newest to oldest.
    const allYears = Array.from(
        new Set([
            new Date().getFullYear(), // Always include the current year
            ...transactions.map(transaction => new Date(transaction.request_date).getFullYear())
        ])
    ).sort((a, b) => b - a);

    const months = [...Array(12).keys()];

    if (loading) {
        return (
            <div className="loader-container">
                <FaSyncAlt className="loader-icon" />
                <p>Loading transactions...</p>
            </div>
        );
    }

    if (error && transactions.length === 0) {
        return (
            <div className="error-container">
                <FaExclamationCircle className="error-icon" />
                <p>{error}</p>
            </div>
        );
    }

    const filteredTransactions = transactions.filter(transaction =>
        new Date(transaction.request_date).getMonth() === selectedMonth &&
        new Date(transaction.request_date).getFullYear() === selectedYear
    );

    return (
        <>
            <Header />
            <div className="withdrawal-history-page">
                <div className="history-header">
                    <h2><FaHistory /> Withdrawal History</h2>
                    <button className="cta-button" onClick={() => window.location.href = '/bank-details'}>
                        Update Bank Details
                    </button>
                </div>

                <div className="income-summary-container">
                    <div className="summary-card">
                        <p className="summary-label">Total Income</p>
                        <h3 className="summary-value">₹{Math.abs(totalIncome).toFixed(2)}</h3>
                    </div>
                    <div className="summary-card">
                        <p className="summary-label">Monthly Income</p>
                        <h3 className="summary-value">₹{Math.abs(monthlyIncome).toFixed(2)}</h3>
                    </div>
                </div>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="month">Month</label>
                        <select id="month" onChange={handleMonthChange} value={selectedMonth}>
                            {months.map(month => (
                                <option key={month} value={month}>
                                    {new Date(0, month).toLocaleString('default', { month: 'long' })}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="filter-group">
                        <label htmlFor="year">Year</label>
                        {/* --- SIMPLIFIED YEAR DROPDOWN --- */}
                        <select id="year" onChange={handleYearChange} value={selectedYear}>
                            {allYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
                
                <div className="transaction-list">
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction, index) => (
                            <div className="transaction-card" key={index}>
                                <div className="transaction-info">
                                    <div className="transaction-date">
                                        <FaCalendarAlt />
                                        <span>{new Date(transaction.request_date).toLocaleDateString()}</span>
                                    </div>
                                    <p className={`transaction-amount ${transaction.amount < 0 ? 'negative' : 'positive'}`}>
                                        ₹{Math.abs(transaction.amount).toFixed(2)}
                                    </p>
                                </div>
                                <div className={`transaction-status ${transaction.status.toLowerCase()}`}>
                                    {transaction.status}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-transactions">No withdrawals available for the selected period.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default TransactionHistory;