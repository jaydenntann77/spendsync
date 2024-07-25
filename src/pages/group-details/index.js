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
import {
    Box,
    Button,
    Container,
    Grid,
    Typography,
    Card,
    CardContent,
    TextField,
    MenuItem,
    CircularProgress,
} from "@mui/material";
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
        return (
            <Typography variant="h6" color="error">
                {error}
            </Typography>
        );
    }

    if (!group || loading) {
        return <CircularProgress />;
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
        <Container maxWidth="lg">
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/groups")}
                sx={{ mt: 2 }}
            >
                Back to Groups
            </Button>
            <BaseCurrencySelector
                onUpdateBaseCurrency={handleBaseCurrencyChange}
            />
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h4">{group.name}</Typography>
                            <Typography variant="subtitle1">
                                {group.description}
                            </Typography>
                            <Typography variant="subtitle2">
                                Members: {group.members.length}
                            </Typography>
                            <Typography variant="subtitle2">
                                Group ID: {group.groupID}
                            </Typography>

                            <Typography variant="h5" className={{ mt: 2 }}>
                                Group Members
                            </Typography>
                            <ul>
                                {membersDetails.map((member) => (
                                    <li key={member.id}>{member.name}</li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Add an Expense</Typography>
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
                            >
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Total Amount"
                                            type="number"
                                            fullWidth
                                            value={amount}
                                            onChange={(e) =>
                                                setAmount(e.target.value)
                                            }
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Description"
                                            type="text"
                                            fullWidth
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            required
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Paid By"
                                            select
                                            fullWidth
                                            value={paidBy}
                                            onChange={(e) =>
                                                setPaidBy(e.target.value)
                                            }
                                            required
                                        >
                                            <MenuItem value="" disabled>
                                                Select Member
                                            </MenuItem>
                                            {membersDetails.map((member) => (
                                                <MenuItem
                                                    key={member.id}
                                                    value={member.name}
                                                >
                                                    {member.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <label>Involved Members:</label>
                                        <Select
                                            isMulti
                                            value={involvedMembers}
                                            onChange={setInvolvedMembers}
                                            options={memberOptions}
                                            className="multi-select"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <label>Currency:</label>
                                        <Select
                                            value={{
                                                value: currency,
                                                label: currency,
                                            }}
                                            onChange={(selected) =>
                                                setCurrency(selected.value)
                                            }
                                            options={currencyOptions}
                                            className="multi-select"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            label="Split Type"
                                            select
                                            fullWidth
                                            value={splitType}
                                            onChange={(e) =>
                                                setSplitType(e.target.value)
                                            }
                                        >
                                            <MenuItem value="equal">
                                                Equal
                                            </MenuItem>
                                            <MenuItem value="manual">
                                                Manual
                                            </MenuItem>
                                        </TextField>
                                    </Grid>
                                    {splitType === "manual" && (
                                        <Grid item xs={12}>
                                            <div>
                                                {involvedMembers.map(
                                                    (member) => (
                                                        <TextField
                                                            key={member.value}
                                                            label={`${member.label}'s share`}
                                                            type="number"
                                                            fullWidth
                                                            value={
                                                                manualSplits[
                                                                    member.value
                                                                ] || ""
                                                            }
                                                            onChange={(e) =>
                                                                handleManualSplitChange(
                                                                    member.value,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            required
                                                        />
                                                    )
                                                )}
                                                {!isTotalValid && (
                                                    <Typography color="error">
                                                        Total of manual splits
                                                        must equal the total
                                                        amount.
                                                    </Typography>
                                                )}
                                            </div>
                                        </Grid>
                                    )}
                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                        >
                                            Add Expense
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h5">Expenses</Typography>
                            <ul>
                                {expenses.map((expense) => (
                                    <li key={expense.id}>
                                        <Typography>
                                            Amount: ${expense.amount.toFixed(2)}{" "}
                                            {groupCurrency}
                                        </Typography>
                                        <Typography>
                                            Description: {expense.description}
                                        </Typography>
                                        <Typography>
                                            Paid By: {expense.paidBy}
                                        </Typography>
                                        {expense.currency &&
                                            expense.currency !==
                                                groupCurrency && (
                                                <Typography>
                                                    Expense Paid in{" "}
                                                    {expense.currency} converted
                                                    to {groupCurrency}
                                                </Typography>
                                            )}
                                        {expense.splitType === "manual" ? (
                                            <Typography>
                                                {expense.involvedMembers.map(
                                                    (member, index) => (
                                                        <span key={index}>
                                                            {member}: $
                                                            {expense.manualSplits
                                                                ? expense.manualSplits[
                                                                      member
                                                                  ].toFixed(2)
                                                                : "N/A"}{" "}
                                                            {groupCurrency}
                                                            {index !==
                                                                expense
                                                                    .involvedMembers
                                                                    .length -
                                                                    1 &&
                                                                ", "}{" "}
                                                        </span>
                                                    )
                                                )}
                                            </Typography>
                                        ) : (
                                            <Typography>
                                                Involved Members:{" "}
                                                {expense.involvedMembers.join(
                                                    ", "
                                                )}
                                            </Typography>
                                        )}
                                        <Typography>
                                            Split Type: {expense.splitType}
                                        </Typography>
                                        <Typography>
                                            Date:{" "}
                                            {new Date(
                                                expense.date.seconds * 1000
                                            ).toLocaleDateString()}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            color="secondary"
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
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <GroupBalances
                        groupId={groupId}
                        refreshBalances={refreshKey}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};
