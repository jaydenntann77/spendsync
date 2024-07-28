import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useAddTransaction } from "../../hooks/useAddTransaction";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import { useSnackbar } from "notistack";
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
    Card,
    CardContent,
    CardHeader,
    Grid,
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
    const { enqueueSnackbar } = useSnackbar();


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
        enqueueSnackbar("Transaction added successfully!", {
            variant: "success",
            autoHideDuration: 2000,
        });
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Add a Transaction!"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
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
                                    <FormLabel component="legend" >Type</FormLabel>
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
                                <Grid container spacing={2} sx={{ mt: 2 }}>
                                    <Grid item xs={8}>
                                        <FormControl fullWidth>
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
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            
                                            sx={{ height: '100%', }}
                                            onClick={() => navigate("/add-transaction/add-category")}
                                        >
                                            Add Category
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#95d5b2",
                                            color: "#fff",
                                            "&:hover": {
                                                backgroundColor: "#82cba1",
                                            },
                                            width: '50%', // Make the button wider
                                            fontSize: '1.2rem', // Increase the font size
                                            padding: '10px 0', // Increase the padding
                                        }}
                                    >
                                        Add Transaction
                                    </Button>
                                </Grid>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};
