// src/pages/expense-tracker/GroupDetails.jsx

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchGroupDetails } from "../../hooks/useFetchGroupDetails";
import { useFetchMembersDetails } from "../../hooks/useFetchMembersDetails";
import { useFetchExpenses } from "../../hooks/useFetchExpenses";
import { useHandleAddExpense } from "../../hooks/useHandleAddExpense";
import { useHandleDeleteExpense } from "../../hooks/useHandleDeleteExpense";
import { useFetchExchangeRates } from "../../hooks/useFetchExchangeRates";
import { useFetchGroupCurrency } from "../../hooks/useFetchGroupCurrency";
import Select from "react-select";
import styles from "./GroupDetails.module.css";
import { GroupBalances } from "../../components/GroupBalances/GroupBalances";
import { BaseCurrencySelector } from "../../components/BaseCurrencySelector/BaseCurrencySelector";

export const GroupDetails = () => {
    const { groupId } = useParams();
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [involvedMembers, setInvolvedMembers] = useState([]);
    const [splitType, setSplitType] = useState("equal");
    const [manualSplits, setManualSplits] = useState({});
    const [currency, setCurrency] = useState("USD");
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();
    const [isTotalValid, setIsTotalValid] = useState(true);

    const { group, error } = useFetchGroupDetails(groupId);
    const membersDetails = useFetchMembersDetails(group);
    const { expenses, fetchExpenses, loading } = useFetchExpenses(
        groupId,
        refreshKey
    );
    const { exchangeRates } = useFetchExchangeRates();
    const { groupCurrency } = useFetchGroupCurrency(groupId);

    const handleAddExpense = useHandleAddExpense(
        groupId,
        fetchExpenses,
        setRefreshKey,
        setAmount,
        setDescription,
        setPaidBy,
        setInvolvedMembers,
        setSplitType,
        setManualSplits,
        currency,
        exchangeRates
    );

    const handleManualSplitChange = (memberId, value) => {
        const updatedManualSplits = {
            ...manualSplits,
            [memberId]: value,
        };
        setManualSplits(updatedManualSplits);

        const total = Object.values(updatedManualSplits).reduce(
            (acc, curr) => acc + parseFloat(curr || 0),
            0
        );
        setIsTotalValid(total === parseFloat(amount));
    };

    const handleDeleteExpense = useHandleDeleteExpense(
        groupId,
        fetchExpenses,
        setRefreshKey
    );

    const handleBaseCurrencyChange = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Trigger a refresh of expenses and balances
    };

    if (error) {
        return <div>{error}</div>;
    }

    if (!group || loading) {
        return <div>Loading...</div>;
    }

    const memberOptions = membersDetails.map((member) => ({
        value: member.name,
        label: member.name,
    }));

    const topCurrencies = [
        "USD",
        "EUR",
        "JPY",
        "GBP",
        "AUD",
        "CAD",
        "CHF",
        "CNY",
        "SEK",
        "NZD",
        "MXN",
        "SGD",
        "HKD",
        "NOK",
        "KRW",
        "TRY",
        "INR",
        "RUB",
        "BRL",
        "ZAR",
    ];

    const currencyOptions = topCurrencies.map((currency) => ({
        value: currency,
        label: currency,
    }));

    return (
        <div className={styles.groupDetails}>
            <button
                className={styles.backButton}
                onClick={() => navigate("/groups")}
            >
                Back to Groups
            </button>
            <BaseCurrencySelector
                onUpdateBaseCurrency={handleBaseCurrencyChange}
            />
            <div className={styles.container}>
                <h1>{group.name}</h1>
                <p>{group.description}</p>
                <p>Members: {group.members.length}</p>
                <p>Group ID: {group.groupID}</p>

                <h3>Group Members</h3>
                <ul className={styles.membersList}>
                    {membersDetails.map((member) => (
                        <li key={member.id}>{member.name}</li>
                    ))}
                </ul>
            </div>
            <div className={styles.container}>
                <h2>Add an Expense</h2>
                <form
                    onSubmit={(e) => {
                        if (isTotalValid) {
                            handleAddExpense(
                                e,
                                amount,
                                description,
                                paidBy,
                                involvedMembers,
                                splitType,
                                manualSplits
                            );
                        } else {
                            e.preventDefault();
                            alert(
                                "Total of manual splits must equal the total amount."
                            );
                        }
                    }}
                    className={styles.expenseForm}
                >
                    <div className={styles.formGroup}>
                        <label>Total Amount:</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description:</label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Paid By:</label>
                        <select
                            value={paidBy}
                            onChange={(e) => setPaidBy(e.target.value)}
                            required
                        >
                            <option value="" disabled>
                                Select Member
                            </option>
                            {membersDetails.map((member) => (
                                <option key={member.id} value={member.name}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Involved Members:</label>
                        <Select
                            isMulti
                            value={involvedMembers}
                            onChange={setInvolvedMembers}
                            options={memberOptions}
                            className={styles.multiSelect}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Currency:</label>
                        <Select
                            value={{ value: currency, label: currency }}
                            onChange={(selected) => setCurrency(selected.value)}
                            options={currencyOptions}
                            className={styles.multiSelect}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Split Type:</label>
                        <select
                            value={splitType}
                            onChange={(e) => setSplitType(e.target.value)}
                        >
                            <option value="equal">Equal</option>
                            <option value="manual">Manual</option>
                        </select>
                    </div>
                    {splitType === "manual" && (
                        <div className={styles.manualSplits}>
                            {involvedMembers.map((member) => (
                                <div
                                    key={member.value}
                                    className={styles.formGroup}
                                >
                                    <label>{member.label}'s share:</label>
                                    <input
                                        type="number"
                                        value={manualSplits[member.value] || ""}
                                        onChange={(e) =>
                                            handleManualSplitChange(
                                                member.value,
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>
                            ))}
                            {!isTotalValid && (
                                <p className={styles.error}>
                                    Total of manual splits must equal the total
                                    amount.
                                </p>
                            )}
                        </div>
                    )}

                    <button type="submit">Add Expense</button>
                </form>
            </div>

            <div className={styles.container}>
                <h2>Expenses</h2>
                <ul className={styles.expensesList}>
                    {expenses.map((expense) => (
                        <li key={expense.id}>
                            <p>Amount: {expense.amount.toFixed(2)}</p>
                            <p>Description: {expense.description}</p>
                            <p>Paid By: {expense.paidBy}</p>
                            {expense.currency &&
                                expense.currency !== groupCurrency && (
                                    <p>
                                        Expense Paid in {expense.currency}{" "}
                                        converted to {groupCurrency}
                                    </p>
                                )}
                            {expense.splitType === "manual" ? (
                                <p>
                                    {expense.involvedMembers.map(
                                        (member, index) => (
                                            <span key={index}>
                                                {member}:{" "}
                                                {expense.manualSplits
                                                    ? expense.manualSplits[
                                                          member
                                                      ]
                                                    : "N/A"}
                                                {index !==
                                                    expense.involvedMembers
                                                        .length -
                                                        1 && ", "}
                                            </span>
                                        )
                                    )}
                                </p>
                            ) : (
                                <p>
                                    Involved Members:{" "}
                                    {expense.involvedMembers.join(", ")}
                                </p>
                            )}
                            <p>Split Type: {expense.splitType}</p>
                            <p>
                                Date:{" "}
                                {new Date(
                                    expense.date.seconds * 1000
                                ).toLocaleDateString()}
                            </p>
                            <button
                                onClick={() =>
                                    handleDeleteExpense(
                                        expense.id,
                                        expense.involvedMembers,
                                        expense.paidBy,
                                        expense.amount,
                                        expense.splitType,
                                        expense.manualSplits
                                    )
                                }
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.container}>
                <GroupBalances groupId={groupId} refreshBalances={refreshKey} />
            </div>
        </div>
    );
};
