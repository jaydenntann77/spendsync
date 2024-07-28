import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Container,
    Card,
    CardHeader,
    CardContent,
    TextField,
    Button,
    Grid,
    Typography,
    Box,
} from "@mui/material";
import { useFetchUserGroups } from "../../hooks/useFetchUserGroups";
import { useCreateGroup } from "../../hooks/useCreateGroup";
import { useJoinGroup } from "../../hooks/useJoinGroup";
import { useSnackbar } from "notistack";

export const Groups = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [joinGroupID, setJoinGroupID] = useState("");
    const { userGroups, fetchUserGroups } = useFetchUserGroups();
    const { createGroup } = useCreateGroup();
    const { joinGroup } = useJoinGroup();
    const { enqueueSnackbar } = useSnackbar();

    const handleCopyGroupId = (groupId) => {
        navigator.clipboard.writeText(groupId);
        enqueueSnackbar("Group ID copied to clipboard!", {
            variant: "success",
            autoHideDuration: 2000,
        });
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        try {
            await createGroup(name, description);
            setName("");
            setDescription("");
            fetchUserGroups();
            enqueueSnackbar("Group created successfully!", {
                variant: "success",
                autoHideDuration: 2000,
            });
        } catch (error) {
            enqueueSnackbar("Failed to create group. Please try again.", {
                variant: "error",
                autoHideDuration: 2000,
            });
        }
    };

    const handleJoinGroup = async (e) => {
        e.preventDefault();
        try {
            await joinGroup(joinGroupID);
            setJoinGroupID("");
            fetchUserGroups();
            enqueueSnackbar("Joined group successfully!", {
                variant: "success",
                autoHideDuration: 2000,
            });
        } catch (error) {
            enqueueSnackbar("Failed to join group. Please try again.", {
                variant: "error",
                autoHideDuration: 2000,
            });
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Create a Group"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
                            <form onSubmit={handleCreateGroup}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Group Name"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        required
                                    />
                                </Box>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Description"
                                        variant="outlined"
                                        fullWidth
                                        value={description}
                                        onChange={(e) =>
                                            setDescription(e.target.value)
                                        }
                                        required
                                    />
                                </Box>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#00b4d8",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#52b788",
                                        },
                                    }}
                                >
                                    Create Group
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Your Groups"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
                            <Grid container spacing={2}>
                                {userGroups.map((group) => (
                                    <Grid
                                        item
                                        xs={12}
                                        sm={6}
                                        md={4}
                                        key={group.id}
                                    >
                                        <Link
                                            to={`/group/${group.id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                            }}
                                        >
                                            <Card
                                                sx={{
                                                    backgroundColor: "#52796f",
                                                    color: "#fff",
                                                    "&:hover": {
                                                        boxShadow: 6,
                                                    },
                                                }}
                                            >
                                                <CardContent>
                                                    <Typography
                                                        variant="h4"
                                                        sx={{
                                                            color: "#000",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        {group.name}
                                                    </Typography>
                                                    <Typography>
                                                        {group.description}
                                                    </Typography>
                                                    <Typography>
                                                        Members:{" "}
                                                        {group.members.length}
                                                    </Typography>
                                                    <Typography>
                                                        Group ID:{" "}
                                                        {group.groupID}
                                                    </Typography>
                                                    <Button
                                                        variant="contained"
                                                        color="primary"
                                                        sx={{ mt: 2 }}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            handleCopyGroupId(
                                                                group.groupID
                                                            );
                                                        }}
                                                    >
                                                        Copy Group ID
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    <Card>
                        <CardHeader
                            title="Join a Group"
                            sx={{
                                textAlign: "center",
                                backgroundColor: "#2d6a4f",
                                color: "#fff",
                            }}
                        />
                        <CardContent>
                            <form onSubmit={handleJoinGroup}>
                                <Box sx={{ mb: 2 }}>
                                    <TextField
                                        label="Group ID"
                                        variant="outlined"
                                        fullWidth
                                        value={joinGroupID}
                                        onChange={(e) =>
                                            setJoinGroupID(e.target.value)
                                        }
                                        required
                                    />
                                </Box>
                                <Button
                                    type="submit"
                                    sx={{
                                        backgroundColor: "#95d5b2",
                                        color: "#fff",
                                        "&:hover": {
                                            backgroundColor: "#52b788",
                                        },
                                    }}
                                >
                                    Join Group
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};
