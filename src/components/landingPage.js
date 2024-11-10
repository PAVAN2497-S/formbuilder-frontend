import { Button, Typography, Container, Box, Card, Divider, CircularProgress, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = ({ formsList, setFormsList }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await fetch('http://localhost:5000/forms');
                const result = await response.json();
                setFormsList(result);
            } catch (error) {
                console.error("Error fetching forms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchForms();
    }, [setFormsList]);

    const handleViewForm = (formId) => {
        navigate(`/form-view/${formId}`);
    };

    const goToFormCreation = () => {
        navigate("/form-creation");
    };

    const handleEditForm = (formId) => {
        navigate(`/form-creation/${formId}`);
    };

    const handleDeleteForm = async (formId) => {
        try {
            const response = await fetch(`http://localhost:5000/forms/${formId}`, {
                method: "DELETE",
            });
            const result = await response.json();
            if (response.ok) {
                setFormsList((prevForms) => prevForms?.filter(form => form?._id !== formId));
                navigate("/");
            } else {
                console.error("Error deleting form:", result);
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    };

    if (loading) {
        return (
            <Container>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container>
            <Typography marginLeft={15} variant="h1" component="h1" gutterBottom>
                Welcome to Form.com
            </Typography>
            <Typography variant="h6" component="h6" gutterBottom align="center">
                This is a simple form builder
            </Typography>
            <Button variant="contained" style={{ marginTop: "20px", marginLeft: "40%" }} color="success" onClick={goToFormCreation}>
                Create New Form
            </Button>
            <div style={{ marginTop: "15px" }}>
                <Divider variant="middle" />
            </div>

            {formsList?.length > 0 ? (
                <Box mt={4}>
                    {formsList?.map((formDetails) => (
                        <Card key={formDetails?._id} sx={{ mb: 2, p: 2, width: 300 }}>
                            <Typography variant="h4" component="h2" gutterBottom align="center">
                                {formDetails?.formTitle}
                            </Typography>
                            <Box display="flex" flexDirection="row" alignItems="center" mt={2}>
                                <Button
                                    variant="text"
                                    color="success"
                                    onClick={() => handleViewForm(formDetails._id)}
                                    sx={{ mx: 1 }}
                                >
                                    View
                                </Button>
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={() => handleEditForm(formDetails._id)}
                                    sx={{ mx: 1 }}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant="text"
                                    color="error"
                                    onClick={() => handleDeleteForm(formDetails._id)}
                                    sx={{ mx: 1 }}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Card>
                    ))}
                </Box>
            ) : (
                <Grid >
                    <h1>Forms</h1>
                    <p className="fw-light">You have no forms created yet</p>
                </Grid>

            )}

        </Container>
    );
};

export default LandingPage;
