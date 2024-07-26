import { Button, Container, Stack, Typography } from "@mui/material";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const ThemeTester = () => {
    return (
        <Container>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "end" }}>
                    <Typography variant="h1">
                        Learn data and AI skills
                    </Typography>
                    <Typography variant="h2">
                        Unlock the power of data and AI
                    </Typography>
                    <Typography variant="subtitle1">
                        Start Learning for Free
                    </Typography>
                    <Typography variant="subtitle2">
                        DataCamp for Business
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Button variant="contained" color="success">
                        Start Learning for Free
                    </Button>
                    <Button variant="outlined" color="primary">
                        DataCamp for Business
                    </Button>
                </Stack>
                <Stack direction="row" spacing={2}>
                    <Fab color="primary">
                        <AddIcon />
                    </Fab>
                    <Fab color="primary" size="medium" variant="square">
                        <AddIcon />
                    </Fab>
                    <Fab color="primary" size="small">
                        <AddIcon />
                    </Fab>
                </Stack>
            </Stack>
        </Container>
    );
};
