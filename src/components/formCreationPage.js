import React, { useEffect, useState } from "react";
import {
    Grid,
    Container,
    Typography,
    IconButton,
    TextField,
    Button,
    Box,
    CardContent,
    Card,
    Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { json, useNavigate, useParams } from "react-router-dom";


const FormFieldCard = ({
    field,
    index,
    handleFieldChange,
    handleEditClick,
    handleDeleteClick,
}) => {
    return (
        <Card
            variant="outlined"
            sx={{ display: "flex", alignItems: "center", mb: 2 }}
        >
            <IconButton>
                <DragIndicatorIcon />
            </IconButton>
            <CardContent sx={{ flexGrow: 1 }}>
                <TextField
                    variant="standard"
                    key={index}
                    value={field.value}
                    onChange={(event) => handleFieldChange(event, index)}
                    disabled
                    fullWidth
                />
            </CardContent>
            <IconButton onClick={() => handleEditClick(field)}>
                <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteClick(field)}>
                <DeleteIcon />
            </IconButton>
        </Card>
    );
};




const FormCreation = ({ handleFormAdd, formsList }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isAddInput, setIsAddInput] = useState(false);
    const [formData, setFormData] = useState({
        formTitle: "Untitled Form",
        formFields: [],
    });
    const [formFieldsValue, setFormFieldsValue] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const navigate = useNavigate();
    const { _id } = useParams();

    useEffect(() => {
        if (_id) {
            const existingForm = formsList.find((form) => form._id === _id);
            if (existingForm) {
                setFormData(existingForm);
                setIsEditMode(true);
            }
        }
    }, [formsList, _id]);

    const handleformsubmit = async (e) => {
        e.preventDefault();
        try {
            const method = isEditMode ? 'PUT' : 'POST';
            const url = isEditMode
                ? `http://localhost:5000/forms/${_id}`
                : 'http://localhost:5000/forms';
    
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
            console.log(data, isEditMode ? "updateFormResponse" : "createFormResponse");
    
            if (response.ok) {
                if (isEditMode) {
                    console.log('Form updated successfully:', data);
                } else {
                    handleFormAdd(data); // Add the new form to the list
                    console.log('Form created successfully:', data);
                }
               
            } else {
                console.error('Error saving form:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };
    

    const handleFormUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/forms/${_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            console.log(data, "updateFormResponse");

            if (response.ok) {
                console.log('Form updated successfully:', data);
                navigate('/');
            } else {
                console.error('Error updating form:', data);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };


    useEffect(() => {
        if (_id) {
            formsList.find((form) => form._id === _id);
            setFormData(formsList.find((form) => form._id === _id) ?? {});
        }
    }, [formsList, _id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleTitleChange = (event) => {
        setFormData({ ...formData, formTitle: event.target.value });
    };

    const handleTitleBlur = () => {
        setIsEditing(false);
    };

    const handleFieldChange = (event, index) => {
        const updatedFields = [...formData.formFields];
        updatedFields[index].value = event.target.value;
        setFormData((prev) => ({
            ...prev,
            formFields: updatedFields,
        }));
    };

    const handleEditFormFieldClick = (field) => {
        setFormFieldsValue({ ...field });
    };

    console.log(formFieldsValue, "formFieldsValue");


    const handleDeleteClick = (field) => {
        const newFormFields = formData.formFields.filter(
            ({ id }) => id !== field.id
        );
        setFormData({ ...formData, formFields: newFormFields });
    };

    const handleAddInput = ({ value }) => {
        const newField = {
            id: Number(new Date()), // Always use a unique ID
            type: value,
            value: "",
            label: "",
        };
        setFormData((prev) => ({
            ...prev,
            formFields: [...prev.formFields, newField],
        }));
    };


    const handleTitlePlaceHolderChange = (type, event) => {
        setFormFieldsValue({ ...formFieldsValue, [type]: event.target.value });
    };

    useEffect(() => {
        if (formFieldsValue) {
            setFormData((prev) => ({
                ...prev,
                formFields: prev.formFields.map((field) => {
                    if (field.id === formFieldsValue.id) {
                        return { ...formFieldsValue };
                    }
                    return field;
                }),
            }));
        }
    }, [formFieldsValue]);

    console.log(formFieldsValue, "formFieldsValue");

    return (
        <Container sx={{ p: 4 }}>
            <Typography variant="h3" className="fw-normal" component="h3" gutterBottom align="center">
                Create new Form
            </Typography>

            <Card sx={{ p: 10 }} className="border border-secondary-subtle">
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Typography
                                variant="h4"
                                component="h2"
                                gutterBottom
                                align="center"
                            >
                                {formData.formTitle}
                                <IconButton onClick={handleEditClick}>
                                    <EditIcon />
                                </IconButton>
                            </Typography>

                            <Grid container spacing={2} mt={2} ml={-9}>
                          
                                {formData?.formFields?.length > 20 ? (
                                    <Grid item xs={12}>
                                        <Typography color="error" variant="h6" align="center">
                                            You cannot add more than 20 fields.
                                        </Typography>
                                    </Grid>
                                ) : (
                                    formData?.formFields?.map((field, index) => (
                                        <Grid item xs={6} key={index}>
                                            <FormFieldCard
                                                field={field}
                                                index={index}
                                                onChange={(event) => handleFieldChange(event, index)}
                                                handleEditClick={handleEditFormFieldClick}
                                                handleDeleteClick={handleDeleteClick}
                                            />
                                        </Grid>
                                    ))
                                )}
                            </Grid>
                            <Divider orientation="horizontal" />
                            {isAddInput ? (
                                <>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        onClick={() => {
                                            setIsAddInput(false);
                                            setFormFieldsValue(null);
                                        }}
                                    >
                                        Close Add Input
                                    </Button>
                                    {formData.formFields.length >= 20 && <p style={{ color: "red" }}>You cannot add more than 20 input fields.</p>}
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="center"
                                        mt={2}
                                    >
                                        {[
                                            { label: "Text", value: "text" },
                                            { label: "Email", value: "email" },
                                            { label: "Number", value: "number" },
                                            { label: "Password", value: "password" },
                                            { label: "Date", value: "date" },
                                        ].map((type) => (
                                            <Button
                                                key={type.value}
                                                variant="contained"
                                                disabled={formData.formFields.length >= 20}
                                                color="primary"
                                                onClick={() => handleAddInput(type)}
                                                sx={{ mx: 1 }}
                                            >
                                                {type.label}
                                            </Button>

                                        ))}
                                    </Box>
                                </>
                            ) : (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => setIsAddInput(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Add Input
                                </Button>
                            )}
                            <Button
                                variant="contained"
                                color="success"

                                onClick={(e) => { handleformsubmit(e) }}
                                sx={{ mt: 2 }}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Grid>
                    <Divider />
                    <Grid item xs={4} className="border-start">
                        <h4 style={{ marginLeft: "100px" }}>Form Editor</h4>
                        {isEditing ? (
                            <TextField
                                variant="standard"
                                value={
                                    formData.formTitle === "Untitled Form"
                                        ? ""
                                        : formData.formTitle
                                }
                                placeholder="Title"
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                autoFocus
                                fullWidth
                            />
                        ) : (
                            null
                        )}
                        {formFieldsValue && !isEditing ? (
                            <>
                                <Typography
                                    variant="h4"
                                    component="h2"
                                    gutterBottom
                                    align="center"
                                >
                                </Typography>
                                <Typography style={{ marginLeft: "150px", fontWeight: "bold" }}>{formFieldsValue.type.toUpperCase()}</Typography>
                                <Box>
                                    <TextField
                                        variant="standard"
                                        value={formFieldsValue.value}
                                        label="Title"
                                        onChange={(event) =>
                                            handleTitlePlaceHolderChange("value", event)
                                        }
                                        fullWidth
                                    />
                                    <TextField
                                        variant="standard"
                                        value={formFieldsValue.label || ""}
                                        label="Placeholder"
                                        onChange={(event) =>
                                            handleTitlePlaceHolderChange("label", event)
                                        }
                                        fullWidth
                                        sx={{ mt: 2 }}
                                    />
                                </Box>
                            </>
                        ) : null}
                    </Grid>
                </Grid>
            </Card>
            <Button
                variant="contained"
                style={{ marginLeft: "50%" }}
                color={isEditMode ? "warning" : "success"}
                onClick={(e) => {
                    if (isEditMode) {
                        handleFormUpdate(e);
                    } else {
                        navigate('/')
                    }
                }}
                sx={{ mt: 2 }}
            >
                {isEditMode ? "Save Form" : "Create Form"}
            </Button>
        </Container>
    );
};

export default FormCreation;
