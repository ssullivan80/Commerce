import { Alert, AlertTitle, Button, ButtonGroup, Container, List, ListItem, ListItemText, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import { useState } from "react";

export default function AboutPage() {

    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    function getValidationError() {
        agent.TestErrors.getValidationError()
            .then(() => console.log('should not see this'))
            .catch(error => setValidationErrors(error));
        console.log(validationErrors.length);
    }

    return (
        <Container>
            <Typography gutterBottom variant="h2">
                About Us
            </Typography>
            <ButtonGroup>
                 <Button variant="contained" onClick={() => agent.TestErrors.get400Error().catch(error => console.log(error))}>400</Button>
                 <Button variant="contained" onClick={() => agent.TestErrors.get401Error().catch(error => console.log(error))}>401</Button>
                 <Button variant="contained" onClick={() => agent.TestErrors.get404Error().catch(error => console.log(error))}>404</Button>
                 <Button variant="contained" onClick={() => agent.TestErrors.get500Error().catch(error => console.log(error))}>500</Button>
                 <Button variant="contained" onClick={getValidationError}>validation</Button>
            </ButtonGroup>
            {
            validationErrors.length > 0 && 
            
                <Alert severity="error">
                    <AlertTitle>Validation Errors</AlertTitle>
                    <List>
                        {validationErrors.map(error => (
                                <ListItem key={error}>
                                    <ListItemText>{error}</ListItemText>
                                </ListItem>
                            ))
                        }
                    </List>
                </Alert>
            }
        </Container>
    )
}