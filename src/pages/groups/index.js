import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Groups.module.css";
import { useFetchUserGroups } from "../../hooks/useFetchUserGroups";
import { useCreateGroup } from "../../hooks/useCreateGroup";
import { useJoinGroup } from "../../hooks/useJoinGroup";

export const Groups = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [joinGroupID, setJoinGroupID] = useState("");
    const { userGroups, fetchUserGroups } = useFetchUserGroups();
    const { createGroup } = useCreateGroup();
    const { joinGroup } = useJoinGroup();

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        await createGroup(name, description);
        setName("");
        setDescription("");
        fetchUserGroups(); // Refresh the group list after creating a new group
    };

    const handleJoinGroup = async (e) => {
        e.preventDefault();
        await joinGroup(joinGroupID);
        setJoinGroupID("");
        fetchUserGroups(); // Refresh the group list after joining a new group
    };

    return (
        <div className={styles.groupsPage}>
            <div className={styles.container}>
                <h1>Create a Group!</h1>
                <form
                    onSubmit={handleCreateGroup}
                    className={styles.createGroupForm}
                >
                    <div className={styles.formGroup}>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                    <button type="submit">Create Group</button>
                </form>
            </div>

            <div className={styles.container}>
                <div className={styles.groupList}>
                    <h1>Your Groups</h1>
                    <ul>
                        {userGroups.map((group) => (
                            <li key={group.id}>
                                <Link to={`/group/${group.id}`}>
                                    <h2>{group.name}</h2>
                                    <p>{group.description}</p>
                                    <p>Members: {group.members.length}</p>
                                    <p>Group ID: {group.groupID}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.joinGroup}>
                    <h1>Join a Group</h1>
                    <form onSubmit={handleJoinGroup}>
                        <div className={styles.formGroup}>
                            <label>Group ID:</label>
                            <input
                                type="text"
                                value={joinGroupID}
                                onChange={(e) => setJoinGroupID(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit">Join Group</button>
                    </form>
                </div>
            </div>
        </div>
    );
};
