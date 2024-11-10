import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Box, Button, Paper, Grid } from "@mui/material";
import * as React from 'react';
import TextField from '@mui/material/TextField';

export default function View() {
    const { _id } = useParams(); 
    const [formDetails, setFormDetails] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (_id) {
            const fetchFormDetails = async () => {
                try {
                    const response = await fetch(`http://localhost:5000/forms/${_id}`);
                    if (!response.ok) {
                        throw new Error("Failed to fetch form details");
                    }
                    const data = await response.json();
                    console.log(data);
                    setFormDetails(data); 
                    const initialFormValues = data.formFields.reduce((acc, field) => {
                        acc[field.value] = ''; 
                        return acc;
                    }, {});
                    setFormValues(initialFormValues);
                } catch (err) {
                    console.error("Error fetching form details:", err);
                }
            };

            fetchFormDetails();
        }
    }, []); 
    const handleChange = (e) => {
        const { name, value } = e.target;

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: "", 
        }));

        setFormValues({
            ...formValues,
            [name]: value,
        });
    };


    const validate = () => {
        let tempErrors = {};

        formDetails.formFields.forEach((field) => {
            const value = formValues[field.value];

            if (!value) {
                tempErrors[field.value] = `${field.label} is required`;
            } else {
                switch (field.type) {
                    case "email":
                        if (!/\S+@\S+\.\S+/.test(value)) {
                            tempErrors[field.value] = "Invalid email format";
                        }
                        break;
                    case "password":
                        if (value.length < 6) {
                            tempErrors[field.value] = "Password must be at least 6 characters";
                        }
                        break;
                    case "number":
                        if (isNaN(value) || value <= 0) {
                            tempErrors[field.value] = "Age must be a positive number";
                        }
                        break;
                    case "date":
                        if (isNaN(Date.parse(value))) {
                            tempErrors[field.value] = "Invalid date format";
                        }
                        break;
                    default:
                        break;
                }
            }
        });

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0; 
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            alert('Form submitted: Thank you! Open console for form data')
            console.log("Form Submitted:", formValues);



        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh", 
                backgroundColor: "#f0f0f0", 
            }}
        >
            <Paper
                elevation={3} 
                sx={{
                    padding: 3, 
                    width: "100%",
                    maxWidth: 600, 
                    textAlign: "center", 
                }}
            >
                <Typography variant="h3" gutterBottom>
                    {formDetails?.formTitle}
                </Typography>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} justifyContent="center">
                        {formDetails?.formFields?.map((ele, index) => (
                            <Grid item xs={6} key={index}>
                                <TextField
                                    fullWidth
                                    id={`field-${index}`}
                                    name={ele.value}
                                    type={ele.type}
                                    label={ele.label}
                                    placeholder={ele.placeholder}
                                    variant="standard"
                                    value={formValues[ele.value] || ""}
                                    onChange={handleChange}
                                    error={!!errors[ele.value]}
                                    helperText={errors[ele.value]}
                                />
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ marginTop: 3 }}>
                        <Button variant="contained" color="primary" sx={{ width: "100%" }} type="submit">
                            Submit
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
