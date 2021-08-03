import Form from "react-bootstrap/Form";
import React from "react";

type ErrorsIfAnyProps = {
    error: string[] | undefined
}

export const ErrorsIfAny = ({error}: ErrorsIfAnyProps): JSX.Element => {
    if(!error) return (<></>)

    return (
        <Form.Control.Feedback type="invalid">
            {error.map((x, idx): JSX.Element =>(<p key={idx}>{x}</p>))}
        </Form.Control.Feedback>
    )
}