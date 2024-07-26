import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import {
    Container,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Paper,
} from "@mui/material";

export const AddTransaction = () => {
    const { addTransaction } = useAddTransaction();
    const navigate = useNavigate();
    const { userID } = useGetUserInfo();

    const [description, setDescription] = useState("");
    const [transactionAmount, setTransactionAmount] = useState(""); // Change initial state to empty string
    const [transactionType, setTransactionType] = useState("expense");
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        if (!userID) return;

        const fetchCategories = async () => {
            const categoriesCollectionRef = collection(
                db,
                "users",
                userID,
                "categories"
            );
            const categoriesSnapshot = await getDocs(categoriesCollectionRef);
            const categoriesList = categoriesSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setCategories(categoriesList);
        };

        fetchCategories();
    }, [userID, transactionType]);

    const onSubmit = (e) => {
        e.preventDefault();
        addTransaction({
            description,
            transactionAmount: parseFloat(transactionAmount), // Convert to number before submitting
            transactionType,
            category: selectedCategory,
        });

        setDescription("");
        setTransactionAmount(""); // Reset to empty string
        setSelectedCategory("");
    };

    return (
        <Container component="main" maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    padding: 4,
                    marginTop: 4,
                    backgroundColor: "rgba(30, 30, 60, 0.9)", // Custom aesthetic color
                }}
            >
                <Typography component="h1" variant="h5">
                    Add a Transaction!
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Description"
                        variant="outlined"
                        value={description}
                        required
                        onChange={(e) => setDescription(e.target.value)}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Amount"
                        type="number"
                        variant="outlined"
                        value={transactionAmount} // Handle as string
                        required
                        onChange={(e) => setTransactionAmount(e.target.value)}
                        margin="normal"
                    />
                    <FormControl component="fieldset" sx={{ mt: 2 }}>
                        <FormLabel component="legend">Type</FormLabel>
                        <RadioGroup
                            row
                            value={transactionType}
                            onChange={(e) => setTransactionType(e.target.value)}
                        >
                            <FormControlLabel
                                value="expense"
                                control={<Radio />}
                                label="Expense"
                            />
                            <FormControlLabel
                                value="income"
                                control={<Radio />}
                                label="Income"
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <Select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select Category
                            </MenuItem>
                            {categories.map((category) => (
                                <MenuItem
                                    key={category.id}
                                    value={category.name}
                                >
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                        <Button
                            sx={{ mt: 1 }}
                            variant="contained"
                            color="primary"
                            onClick={() => navigate("/add-category")}
                        >
                            Add Category
                        </Button>
                    </FormControl>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="success"
                        sx={{ mt: 3 }}
                    >
                        Add Transaction
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};
