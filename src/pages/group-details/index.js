import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFetchGroupDetails } from "../../hooks/useFetchGroupDetails";
import { useFetchMembersDetails } from "../../hooks/useFetchMembersDetails";
import { useFetchExpenses } from "../../hooks/useFetchExpenses";
import { useHandleAddExpense } from "../../hooks/useHandleAddExpense";
import Select from "react-select";
import styles from "./GroupDetails.module.css";
import { GroupBalances } from "../../components/GroupBalances/GroupBalances";

export const GroupDetails = () => {
    const { groupId } = useParams();
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [involvedMembers, setInvolvedMembers] = useState([]);
    const [splitType, setSplitType] = useState("equal");
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const { group, error } = useFetchGroupDetails(groupId);
    const membersDetails = useFetchMembersDetails(group);
    const { expenses, fetchExpenses } = useFetchExpenses(groupId);
    const handleAddExpense = useHandleAddExpense(
        groupId,
        fetchExpenses,
        setRefreshKey,
        setAmount,
        setPaidBy,
        setInvolvedMembers,
        setSplitType
    );

    if (error) {
        return <div>{error}</div>;
    }

    if (!group) {
        return <div>Loading...</div>;
    }

    const memberOptions = membersDetails.map((member) => ({
        value: member.name,
        label: member.name,
    }));

    return (
        <div className={styles.groupDetails}>
            <button
                className={styles.backButton}
                onClick={() => navigate("/groups")}
            >
                Back to Groups
            </button>
            <h1>{group.name}</h1>
            <p>{group.description}</p>
            <p>Members: {group.members.length}</p>
            <p>Group ID: {group.groupID}</p>

            <h2>Group Members</h2>
            <ul className={styles.membersList}>
                {membersDetails.map((member) => (
                    <li key={member.id}>{member.name}</li>
                ))}
            </ul>

            <h2>Add an Expense</h2>
            <form
                onSubmit={(e) =>
                    handleAddExpense(
                        e,
                        amount,
                        paidBy,
                        involvedMembers,
                        splitType
                    )
                }
                className={styles.expenseForm}
            >
                <div className={styles.formGroup}>
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
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
                    <label>Split Type:</label>
                    <select
                        value={splitType}
                        onChange={(e) => setSplitType(e.target.value)}
                    >
                        <option value="equal">Equal</option>
                        <option value="percentage">Percentage</option>
                    </select>
                </div>
                <button type="submit">Add Expense</button>
            </form>

            <h2>Expenses</h2>
            <ul className={styles.expensesList}>
                {expenses.map((expense) => (
                    <li key={expense.id}>
                        <p>Amount: {expense.amount}</p>
                        <p>Paid By: {expense.paidBy}</p>
                        <p>
                            Involved Members:{" "}
                            {expense.involvedMembers.join(", ")}
                        </p>
                        <p>Split Type: {expense.splitType}</p>
                        <p>
                            Date:{" "}
                            {new Date(
                                expense.date.seconds * 1000
                            ).toLocaleDateString()}
                        </p>
                    </li>
                ))}
            </ul>

            <GroupBalances groupId={groupId} refreshBalances={refreshKey} />
        </div>
    );
};
