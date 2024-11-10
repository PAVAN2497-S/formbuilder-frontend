import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/landingPage.js";
import FormCreation from "./components/formCreationPage.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import View from "./components/view.js";
function App() {
  const [forms, setForms] = useState([]);

  const handleFormAdd = (newForm) => {
    setForms((prev) => [...prev, newForm]);
  };

  useEffect(() => {
    // Fetch data from the backend
    const fetchForms = async () => {
      try {
        const response = await fetch('http://localhost:5000/forms');
        if (!response.ok) {
          throw new Error('Failed to fetch forms');
        }
        const data = await response.json();
        setForms(data); // Update the state with the fetched data
        // Set loading to false after data is fetched
      } catch (err) {
        console.log(err.message); // Set the error state if something went wrong
        
      }
    };
    fetchForms(); // Call the function to fetch the data
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage formsList={forms} setFormsList={setForms} />} />
        <Route
          path="/form-creation"
          element={<FormCreation handleFormAdd={handleFormAdd} />}
        />
        <Route
          path="/form-creation/:_id"
          element={
            <FormCreation handleFormAdd={handleFormAdd} formsList={forms} />
          }
        />
        <Route
          path="/form-view/:_id"
          element={
            <View />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;