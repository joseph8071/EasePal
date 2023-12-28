import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Slider,
  FormControlLabel,
  RadioGroup,
  Radio,
  Checkbox,
  FormGroup,
  Select,
  MenuItem,
} from "@mui/material";
// @ts-ignore
const StepForm = ({ onFormSubmit }) => {
  const flexibilityLevels = [
    { value: 1, label: "Very Limited" },
    { value: 2, label: "Limited" },
    { value: 3, label: "Moderate" },
    { value: 4, label: "Flexible" },
    { value: 5, label: "Very Flexible" },
  ];
  // @ts-ignore
  const handleSliderChange = (name) => (event, value) => {
    setAnswers({ ...answers, [name]: value });
  };
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: string]: any;
    ageRange: string;
  }>({ ageRange: "" });
  const [specificAreas, setSpecificAreas] = useState("");
  // @ts-ignore
  const [equipment, setEquipment] = useState("");

  const handleChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };
// @ts-ignore
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      fitnessGoals: {
        ...prevAnswers.fitnessGoals,
        [name]: checked,
      },
    }));
  };
  const questions = [
    {
      label: "What is your age range?",
      name: "ageRange",
      component: (
        <Select
          name="ageRange"
          onChange={handleChange}
          value={answers.ageRange || ""}
          sx={{ width: "115px", mt: 2 }}
        >
          <MenuItem sx={{ color: "black" }} value="Under 20">
            Under 20
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="20-30">
            20-30
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="31-40">
            31-40
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="41-50">
            41-50
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="51-60">
            51-60
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="Over 60">
            Over 60
          </MenuItem>
        </Select>
      ),
    },
    {
      label: "What are your primary fitness goals? (Select all that apply)",
      name: "fitnessGoals",
      component: (
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChange}
                name="Flexibility Improvement"
              />
            }
            label="Flexibility Improvement"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChange}
                name="Muscle Strengthening"
              />
            }
            label="Muscle Strengthening"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChange}
                name="Cardiovascular Health"
              />
            }
            label="Cardiovascular Health"
          />
          <FormControlLabel
            control={
              <Checkbox
                onChange={handleCheckboxChange}
                name="General Wellness"
              />
            }
            label="General Wellness"
          />
        </FormGroup>
      ),
    },
    {
      label: "Rate your current level of flexibility",
      name: "flexibilityLevel",
      component: (
        <Box sx={{ height: 310, mt: 4, mb: 2 }}>
          <Slider
            orientation="vertical"
            aria-label="Flexibility Level"
            value={answers.flexibilityLevel}
            onChange={handleSliderChange("flexibilityLevel")}
            valueLabelDisplay="auto"
            marks={flexibilityLevels}
            step={null}
            min={1}
            max={5}
          />
        </Box>
      ),
    },
    {
      label: "Can you touch your toes without bending your knees?",
      name: "touchToes",
      component: (
        <RadioGroup
          name="touchToes"
          onChange={handleChange}
          value={answers.touchToes || ""}
        >
          <FormControlLabel
            value="Yes"
            control={<Radio />}
            label="Yes"
            sx={{ color: "white" }}
          />
          <FormControlLabel
            value="No"
            control={<Radio />}
            label="No"
            sx={{ color: "white" }}
          />
        </RadioGroup>
      ),
    },
    {
      label:
        "How many days per week can you dedicate to your exercise routine?",
      name: "daysPerWeek",
      component: (
        <Select
          name="daysPerWeek"
          onChange={handleChange}
          value={answers.daysPerWeek || ""}
          sx={{ width: "115px", mt: 2 }}
        >
          <MenuItem sx={{ color: "black" }} value="1-2 days">
            1-2 days
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="3-4 days">
            3-4 days
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="5-6 days">
            5-6 days
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="Everyday">
            Everyday
          </MenuItem>
        </Select>
      ),
    },
    {
      label: "What is your preferred duration for each exercise session?",
      name: "durationPerSession",
      component: (
        <Select
          name="durationPerSession"
          onChange={handleChange}
          value={answers.durationPerSession || ""}
          sx={{ width: "auto", mt: 2 }}
        >
          <MenuItem sx={{ color: "black" }} value="5 minutes">
            5 minutes
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="10 minutes">
            10 minutes
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="20 minutes">
            20 minutes
          </MenuItem>
          <MenuItem sx={{ color: "black" }} value="30+ minutes">
            30+ minutes
          </MenuItem>
        </Select>
      ),
    },
    {
      label:
        "Do you have any specific areas to improve mobility in? Please specify.",
      name: "specificAreas",
      component: (
        <TextField
          sx={{ pr: 6, width: "600px" }}
          name="specificAreas"
          onChange={(e) => setSpecificAreas(e.target.value)}
          value={specificAreas}
        />
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalString = formatAnswersToString();
      onFormSubmit(finalString); // Pass the final string to the Chat component
    }
  };

  const formatAnswersToString = () => {
    let finalMessage = "Make me a stretching schedule based on my data:\n";

    // Age Range
    if (answers.ageRange) {
      finalMessage += `I am in the ${answers.ageRange} age range.\n`;
    }

    // Fitness Goals
    if (answers.fitnessGoals) {
      const selectedGoals = Object.entries(answers.fitnessGoals)
        .filter(([_, checked]) => checked)
        .map(([goal]) => goal);
      if (selectedGoals.length > 0) {
        finalMessage += `My primary fitness goals are ${selectedGoals.join(
          ", "
        )}.`;
      } else {
        finalMessage += `I have not specified any primary fitness goals.`;
      }
    }

    // Flexibility Level
    if (answers.flexibilityLevel) {
      const flexibilityMap = {
        1: "Very Limited",
        2: "Limited",
        3: "Moderate",
        4: "Flexible",
        5: "Very Flexible",
      };
      finalMessage += `My flexibility level is ${
        // @ts-ignore
        flexibilityMap[answers.flexibilityLevel]
      }.\n`;
    }

    // Touch Toes
    if (answers.touchToes) {
      finalMessage += `I ${
        answers.touchToes === "Yes" ? "can" : "cannot"
      } touch my toes without bending my knees.\n`;
    }

    // Days Per Week
    if (answers.daysPerWeek) {
      finalMessage += `I can dedicate ${answers.daysPerWeek} per week to my exercise routine.\n`;
    }

    // Duration Per Session
    if (answers.durationPerSession) {
      finalMessage += `My preferred duration for each exercise session is ${answers.durationPerSession}.\n`;
    }

    // Specific Areas
    if (specificAreas) {
      finalMessage += `I want to focus on improving mobility in these areas: ${specificAreas}.\n`;
    }

    return finalMessage;
  };

  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
    >
      <Typography>{questions[currentStep].label}</Typography>
      {questions[currentStep].component}
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button
          onClick={handleNext}
          sx={{
            px: 1,
            color: "white",
            bgcolor: "#5b91d1",
            ":hover": { bgcolor: "#29323d" },
          }}
        >
          {currentStep === questions.length - 1 ? "Submit" : "Next"}
        </Button>
      </Box>
    </Box>
  );
};

export default StepForm;
