import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { db } from "../../config/firebase-config";
import { useGetUserInfo } from "../../hooks/useGetUserInfo";
import {
    Container,
    TextField,
    Button,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Box,
    Typography,
    Card,
    CardContent,
    CardHeader,
    Grid,
} from "@mui/material";
import { useSnackbar } from "notistack";

export const AddCategory = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const [categoryType, setCategoryType] = useState("expense");
    const { userID } = useGetUserInfo();
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
    }, [userID]);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!userID) return;

        // Check for duplicate category (case insensitive)
        const categoryExists = categories.some(
            (category) =>
                category.name.toLowerCase() === newCategory.toLowerCase()
        );

        if (categoryExists) {
            enqueueSnackbar("Error: Category already exists!", {
                variant: "error",
                autoHideDuration: 2000,
            });
            return; // Stop further execution
        }

        const categoriesCollectionRef = collection(
            db,
            "users",
            userID,
            "categories"
        );
        await addDoc(categoriesCollectionRef, {
            name: newCategory,
            type: categoryType,
        });

        // Refresh categories list
        const categoriesSnapshot = await getDocs(categoriesCollectionRef);
        const categoriesList = categoriesSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setCategories(categoriesList);

        // Reset input
        setNewCategory("");
        enqueueSnackbar("Category created successfully!", {
            variant: "success",
            autoHideDuration: 2000,
        });
    };

    const handleDeleteCategory = async (categoryId) => {
        if (!userID) return;

        const categoryDocRef = doc(
            db,
            "users",
            userID,
            "categories",
            categoryId
        );
        await deleteDoc(categoryDocRef);

        // Refresh categories list
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
        enqueueSnackbar("Category deleted successfully!", {
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
                            title="Add a New Category"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
                            <Box
                                component="form"
                                onSubmit={handleAddCategory}
                                sx={{ mt: 2 }}
                            >
                                <TextField
                                    fullWidth
                                    label="New Category"
                                    variant="outlined"
                                    value={newCategory}
                                    required
                                    onChange={(e) =>
                                        setNewCategory(e.target.value)
                                    }
                                    margin="normal"
                                />
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                row
                                                value={categoryType}
                                                onChange={(e) =>
                                                    setCategoryType(
                                                        e.target.value
                                                    )
                                                }
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
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="success"
                                            fullWidth
                                        >
                                            Add Category
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Button
                                onClick={() => navigate("/add-transaction")}
                                sx={{ mt: 3 }}
                                variant="outlined"
                                color="secondary"
                                fullWidth
                            >
                                Back to Add Transaction
                            </Button>
                            <Typography
                                component="h2"
                                variant="h4"
                                sx={{ mt: 4 }}
                            >
                                Existing Categories
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                {categories.map((category) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={category.id}
                                    >
                                        <Card
                                            sx={{
                                                backgroundColor: "#1c2237",
                                                color: "#fff",
                                                "&:hover": {
                                                    boxShadow: 6,
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Typography variant="h5">
                                                    {category.name}
                                                </Typography>
                                                <Typography variant="h6">
                                                    Type:{" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                category.type ===
                                                                "expense"
                                                                    ? "red"
                                                                    : "#52b788",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {category.type}
                                                    </span>
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category.id
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
            </Grid>
        </Container>
    );
};
