import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    doc,
    getDoc,
    collection,
    addDoc,
    getDocs,
    runTransaction,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Select from "react-select";
import styles from "./GroupDetails.module.css";
import { GroupBalances } from "../../components/GroupBalances/GroupBalances";

export const GroupDetails = () => {
    const { groupId } = useParams();
    const [group, setGroup] = useState(null);
    const [error, setError] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [membersDetails, setMembersDetails] = useState([]);
    const [amount, setAmount] = useState("");
    const [paidBy, setPaidBy] = useState("");
    const [involvedMembers, setInvolvedMembers] = useState([]);
    const [splitType, setSplitType] = useState("equal");
    const [refreshKey, setRefreshKey] = useState(0);
    const navigate = useNavigate();

    const fetchGroupDetails = useCallback(async () => {
        try {
            const groupRef = doc(db, "groups", groupId);
            const groupDoc = await getDoc(groupRef);
            if (groupDoc.exists()) {
                setGroup(groupDoc.data());
            } else {
                console.error("Group not found");
                setError("Group not found");
            }
        } catch (err) {
            console.error("Error fetching group details:", err);
            setError("Error fetching group details");
        }
    }, [groupId]);

    const fetchMembersDetails = useCallback(async () => {
        if (group && group.members) {
            try {
                const memberPromises = group.members.map(async (memberId) => {
                    const userRef = doc(db, "users", memberId);
                    const userDoc = await getDoc(userRef);
                    return userDoc.exists()
                        ? { id: memberId, ...userDoc.data() }
                        : null;
                });
                const members = await Promise.all(memberPromises);
                setMembersDetails(members.filter((member) => member !== null));
            } catch (err) {
                console.error("Error fetching member details:", err);
            }
        }
    }, [group]);

    const fetchExpenses = useCallback(async () => {
        try {
            const expensesRef = collection(db, "groups", groupId, "expenses");
            const expensesSnapshot = await getDocs(expensesRef);
            const expensesList = expensesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setExpenses(expensesList);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        }
    }, [groupId]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    useEffect(() => {
        fetchMembersDetails();
    }, [fetchMembersDetails]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const members = involvedMembers.map((member) => member.value);
        const splitAmount = parseFloat(amount) / members.length;

        try {
            await runTransaction(db, async (transaction) => {
                const expensesRef = collection(
                    db,
                    "groups",
                    groupId,
                    "expenses"
                );
                await addDoc(expensesRef, {
                    amount: parseFloat(amount),
                    paidBy,
                    involvedMembers: members,
                    splitType,
                    date: new Date(),
                });

                // Update balances
                const balancesRef = collection(
                    db,
                    "groups",
                    groupId,
                    "balances"
                );
                for (const member of members) {
                    if (member !== paidBy) {
                        const balanceDocRef = doc(
                            balancesRef,
                            `${paidBy}_${member}`
                        );
                        const reverseBalanceDocRef = doc(
                            balancesRef,
                            `${member}_${paidBy}`
                        );
                        // Update balance from member to paidBy
                        const balanceDoc = await transaction.get(balanceDocRef);
                        const reverseBalanceDoc = await transaction.get(
                            reverseBalanceDocRef
                        );

                        let balanceAmount = -splitAmount;
                        let reverseBalanceAmount = splitAmount;

                        if (balanceDoc.exists()) {
                            balanceAmount += balanceDoc.data().amount;
                        }

                        if (reverseBalanceDoc.exists()) {
                            reverseBalanceAmount +=
                                reverseBalanceDoc.data().amount;
                        }

                        transaction.set(balanceDocRef, {
                            from: paidBy,
                            to: member,
                            amount: balanceAmount,
                        });

                        transaction.set(reverseBalanceDocRef, {
                            from: member,
                            to: paidBy,
                            amount: reverseBalanceAmount,
                        });
                    }
                }
            });

            setAmount("");
            setPaidBy("");
            setInvolvedMembers([]);
            setSplitType("equal");

            // Fetch updated expenses and balances
            fetchExpenses();
            setRefreshKey((prevKey) => prevKey + 1); // Update refreshKey to trigger balances update
        } catch (err) {
            console.error("Error adding expense:", err);
        }
    };

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
            <form onSubmit={handleAddExpense} className={styles.expenseForm}>
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
