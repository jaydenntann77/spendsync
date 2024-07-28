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
    CardHeader,
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
        <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                <Grid item xs={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate("/groups")}
                        sx={{
                            width: "100%",
                            backgroundColor: "#4caf50",
                            color: "#fff",
                        }}
                    >
                        Back to Groups
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <BaseCurrencySelector
                        onUpdateBaseCurrency={handleBaseCurrencyChange}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                        <CardHeader
                            title={group.name}
                            subheader={group.description}
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                                padding: 2,
                            }}
                            titleTypographyProps={{ variant: "h4" }}
                            subheaderTypographyProps={{
                                variant: "subtitle1",
                                fontStyle: "italic",
                            }}
                        />
                        <CardContent sx={{ padding: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h6" gutterBottom>
                                        Members: {group.members.length}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography
                                        variant="h5"
                                        color="textSecondary"
                                    >
                                        Group ID: {group.groupID}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            mt: 3,
                                            mb: 2,
                                            textAlign: "center",
                                        }}
                                    >
                                        Group Members
                                    </Typography>
                                    <ul>
                                        {membersDetails.map((member) => (
                                            <li key={member.id}>
                                                {member.name}
                                            </li>
                                        ))}
                                    </ul>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Add an Expense"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
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
                                            InputLabelProps={{
                                                style: { color: "#fff" },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    "& fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                },
                                            }}
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
                                            InputLabelProps={{
                                                style: { color: "#fff" },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    "& fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                },
                                            }}
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
                                            InputLabelProps={{
                                                style: { color: "#fff" },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    "& fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                },
                                                "& .MuiSelect-select": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                },
                                            }}
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
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#fff", mb: 1 }}
                                        >
                                            Involved Members:
                                        </Typography>
                                        <Select
                                            isMulti
                                            value={involvedMembers}
                                            onChange={setInvolvedMembers}
                                            options={memberOptions}
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    borderColor: "#fff",
                                                    "&:hover": {
                                                        borderColor: "#fff",
                                                    },
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: "#fff",
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    zIndex: 9999, // Ensure the dropdown appears above other elements
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor:
                                                        state.isSelected
                                                            ? "#4caf50"
                                                            : "#1c2237",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#4caf50",
                                                    },
                                                }),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#fff", mb: 1 }}
                                        >
                                            Currency:
                                        </Typography>
                                        <Select
                                            value={{
                                                value: currency,
                                                label: currency,
                                            }}
                                            onChange={(selected) =>
                                                setCurrency(selected.value)
                                            }
                                            options={currencyOptions}
                                            classNamePrefix="react-select"
                                            styles={{
                                                control: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    borderColor: "#fff",
                                                    "&:hover": {
                                                        borderColor: "#fff",
                                                    },
                                                }),
                                                singleValue: (provided) => ({
                                                    ...provided,
                                                    color: "#fff",
                                                }),
                                                menu: (provided) => ({
                                                    ...provided,
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    zIndex: 9999, // Ensure the dropdown appears above other elements
                                                }),
                                                option: (provided, state) => ({
                                                    ...provided,
                                                    backgroundColor:
                                                        state.isSelected
                                                            ? "#4caf50"
                                                            : "#1c2237",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        backgroundColor:
                                                            "#4caf50",
                                                    },
                                                }),
                                            }}
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
                                            InputLabelProps={{
                                                style: { color: "#fff" },
                                            }}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                    "& fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&:hover fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#fff",
                                                    },
                                                },
                                                "& .MuiSelect-select": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                },
                                                "& .MuiPaper-root": {
                                                    backgroundColor: "#1c2237",
                                                    color: "#fff",
                                                },
                                            }}
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
                                                            InputLabelProps={{
                                                                style: {
                                                                    color: "#fff",
                                                                },
                                                            }}
                                                            sx={{
                                                                "& .MuiOutlinedInput-root":
                                                                    {
                                                                        backgroundColor:
                                                                            "#1c2237",
                                                                        color: "#fff",
                                                                        "& fieldset":
                                                                            {
                                                                                borderColor:
                                                                                    "#fff",
                                                                            },
                                                                        "&:hover fieldset":
                                                                            {
                                                                                borderColor:
                                                                                    "#fff",
                                                                            },
                                                                        "&.Mui-focused fieldset":
                                                                            {
                                                                                borderColor:
                                                                                    "#fff",
                                                                            },
                                                                    },
                                                                mt: 2,
                                                            }}
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
                                            sx={{
                                                backgroundColor: "#00b4d8",
                                                color: "#fff",
                                                "&:hover": {
                                                    backgroundColor: "#52b788",
                                                },
                                                display: "block",
                                                marginLeft: "auto",
                                                marginRight: "auto",
                                            }}
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
                        <CardHeader
                            title="Expenses"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
                            <Grid container spacing={3}>
                                {expenses.map((expense) => (
                                    <Grid item xs={12} md={6} key={expense.id}>
                                        <Card
                                            sx={{
                                                backgroundColor: "#1c2237",
                                                color: "#fff",
                                                padding: 2,
                                                "&:hover": {
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    gutterBottom
                                                >
                                                    Amount: $
                                                    {expense.amount.toFixed(2)}{" "}
                                                    {groupCurrency}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Description:{" "}
                                                    {expense.description}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Paid By: {expense.paidBy}
                                                </Typography>
                                                {expense.currency &&
                                                    expense.currency !==
                                                        groupCurrency && (
                                                        <Typography variant="body1">
                                                            Expense Paid in{" "}
                                                            {expense.currency}{" "}
                                                            converted to{" "}
                                                            {groupCurrency}
                                                        </Typography>
                                                    )}
                                                {expense.splitType ===
                                                "manual" ? (
                                                    <Typography variant="body1">
                                                        {expense.involvedMembers.map(
                                                            (member, index) => (
                                                                <span
                                                                    key={index}
                                                                >
                                                                    {member}: $
                                                                    {expense.manualSplits
                                                                        ? expense.manualSplits[
                                                                              member
                                                                          ].toFixed(
                                                                              2
                                                                          )
                                                                        : "N/A"}{" "}
                                                                    {
                                                                        groupCurrency
                                                                    }
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
                                                    <Typography variant="body1">
                                                        Involved Members:{" "}
                                                        {expense.involvedMembers.join(
                                                            ", "
                                                        )}
                                                    </Typography>
                                                )}
                                                <Typography variant="body1">
                                                    Split Type:{" "}
                                                    {expense.splitType}
                                                </Typography>
                                                <Typography variant="body1">
                                                    Date:{" "}
                                                    {new Date(
                                                        expense.date.seconds *
                                                            1000
                                                    ).toLocaleDateString()}
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="error"
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
                                                    sx={{ mt: 2 }}
                                                >
                                                    Delete
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
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
