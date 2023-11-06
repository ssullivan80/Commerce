import { Button, ButtonGroup, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { decrement, increment } from "./counterSlice";

export default function ContactPage() {
    const dispatch = useAppDispatch();
    const {data, title} = useAppSelector((state) => state.counter)
    return (
        <>
        <Typography variant="h2">
            Contact Us
        </Typography>
        <Typography variant="h5">
            {title}{data}
        </Typography>
        <ButtonGroup>
            <Button onClick={() => dispatch(decrement(1))} variant="contained">Decrement</Button>
            <Button onClick={() => dispatch(increment(1))} variant="contained">Increment</Button>
            <Button onClick={() => dispatch(increment(5))} variant="contained">Increment by 5</Button>
        </ButtonGroup>
        </>        
    )
}