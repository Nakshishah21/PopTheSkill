import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Spinner, Form, Badge, Tabs, Tab } from "react-bootstrap";
import axios from "axios";
import { skills } from "./Skills";
import "./Register.css";
import { v4 as uuidv4 } from "uuid";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    portfolioLink: "",
    githubLink: "",
    linkedinLink: "",
    skillsProficientAt: [],
    skillsToLearn: [],
    education: [
      {
        id: uuidv4(),
        institution: "",
        degree: "",
        startDate: "",
        endDate: "",
        score: "",
        description: "",
      },
    ],
    bio: "",
    projects: [],
  });
  const [skillsProficientAt, setSkillsProficientAt] = useState("Select some skill");
  const [skillsToLearn, setSkillsToLearn] = useState("Select some skill");
  const [techStack, setTechStack] = useState([]);

  const [activeKey, setActiveKey] = useState("registration");

  useEffect(() => {
    setLoading(true);
    const getUser = async () => {
      try {
        const { data } = await axios.get("/user/unregistered/getDetails");
        setForm((prevState) => ({
          ...prevState,
          name: data.data.name,
          email: data.data.email,
        }));
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const inputStyle = {
    borderRadius: "5px",
    border: "1px solid #3BB4A1",
    padding: "5px",
    width: "100%",
  };

  const labelStyle = { color: "#3BB4A1" };
  const previewLabelStyle = { flex: 1, fontWeight: "bold", color: "#3BB4A1" };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "bio" && value.length > 500) {
      toast.error("Bio should be less than 500 characters");
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    const name = e.target.name;
    const selectedSkill = name === "skill_to_learn" ? skillsToLearn : skillsProficientAt;
    const targetArray = name === "skill_to_learn" ? "skillsToLearn" : "skillsProficientAt";
    const otherArray = name === "skill_to_learn" ? "skillsProficientAt" : "skillsToLearn";
    
    if (selectedSkill === "Select some skill") {
      toast.error("Select a skill to add");
      return;
    }
    if (form[targetArray].includes(selectedSkill) || form[otherArray].includes(selectedSkill)) {
      toast.error("Skill already added");
      return;
    }
    
    setForm(prev => ({ ...prev, [targetArray]: [...prev[targetArray], selectedSkill] }));
  };

  const validateRegForm = () => {
    if (!form.username) return toast.error("Username is empty"), false;
    if (!form.skillsProficientAt.length) return toast.error("Enter atleast one Skill you are proficient at"), false;
    if (!form.skillsToLearn.length) return toast.error("Enter atleast one Skill you want to learn"), false;
    if (!form.portfolioLink && !form.githubLink && !form.linkedinLink) return toast.error("Enter atleast one link among portfolio, github and linkedin"), false;
    
    const githubRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+(?:\/)?$/;
    const linkedinRegex = /^(?:http(?:s)?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+(?:\/)?$/;
    
    if (form.githubLink && !githubRegex.test(form.githubLink)) return toast.error("Enter a valid github link"), false;
    if (form.linkedinLink && !linkedinRegex.test(form.linkedinLink)) return toast.error("Enter a valid linkedin link"), false;
    if (form.portfolioLink && !form.portfolioLink.includes("http")) return toast.error("Enter a valid portfolio link"), false;
    
    return true;
  };
  const validateEduForm = () => {
    for (let i = 0; i < form.education.length; i++) {
      const edu = form.education[i];
      if (!edu.institution) return toast.error(`Institution name is empty in education field ${i + 1}`), false;
      if (!edu.degree) return toast.error("Degree is empty"), false;
      if (!edu.startDate) return toast.error("Start date is empty"), false;
      if (!edu.endDate) return toast.error("End date is empty"), false;
      if (!edu.score) return toast.error("Score is empty"), false;
    }
    return true;
  };
  const validateAddForm = () => {
    if (!form.bio) return toast.error("Bio is empty"), false;
    if (form.bio.length > 500) return toast.error("Bio should be less than 500 characters"), false;
    
    for (let i = 0; i < form.projects.length; i++) {
      const project = form.projects[i];
      if (!project.title) return toast.error(`Title is empty in project ${i + 1}`), false;
      if (!project.techStack.length) return toast.error(`Tech Stack is empty in project ${i + 1}`), false;
      if (!project.startDate) return toast.error(`Start Date is empty in project ${i + 1}`), false;
      if (!project.endDate) return toast.error(`End Date is empty in project ${i + 1}`), false;
      if (!project.projectLink) return toast.error(`Project Link is empty in project ${i + 1}`), false;
      if (!project.description) return toast.error(`Description is empty in project ${i + 1}`), false;
    }
    return true;
  };
  const handleSave = async (endpoint, validator, successMsg) => {
    if (!validator()) return;
    setSaveLoading(true);
    try {
      await axios.post(endpoint, form);
      toast.success(successMsg);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Some error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleSaveRegistration = () => handleSave("/user/unregistered/saveRegDetails", validateRegForm, "Details saved successfully");
  const handleSaveEducation = () => handleSave("/user/unregistered/saveEduDetail", () => validateRegForm() && validateEduForm(), "Details saved successfully");
  const handleSaveAdditional = () => handleSave("/user/unregistered/saveAddDetail", () => validateRegForm() && validateEduForm() && validateAddForm(), "Details saved successfully");

  const handleSubmit = async () => {
    if (!validateRegForm() || !validateEduForm() || !validateAddForm()) return;
    
    setSaveLoading(true);
    try {
      const { data } = await axios.post("/user/registerUser", form);
      toast.success("Registration Successful");
      navigate("/discover");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Some error occurred");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEducationChange = (e, index) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => i === index ? { ...edu, [name]: value } : edu)
    }));
  };

  const handleAdditionalChange = (e, index) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => i === index ? { ...project, [name]: value } : project)
    }));
  };

  const handleRemoveEducation = (id) => setForm(prev => ({ ...prev, education: prev.education.filter(edu => edu.id !== id) }));
  
  const handleAddEducation = () => setForm(prev => ({
    ...prev,
    education: [...prev.education, { id: uuidv4(), institution: "", degree: "", startDate: "", endDate: "", score: "", description: "" }]
  }));

  const handleAddProject = () => {
    const newProject = { id: uuidv4(), title: "", techStack: [], startDate: "", endDate: "", projectLink: "", description: "" };
    setForm(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
    setTechStack(prev => [...prev, "Select some Tech Stack"]);
  };

  const handleRemoveProject = (id) => {
    setForm(prev => ({ ...prev, projects: prev.projects.filter(project => project.id !== id) }));
  };

  const handleAddTechStack = (projectIndex) => {
    const selected = techStack[projectIndex];
    if (selected === "Select some Tech Stack") return toast.error("Select a tech stack to add");
    if (form.projects[projectIndex].techStack.includes(selected)) return toast.error("Tech Stack already added");
    
    setForm(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === projectIndex ? { ...project, techStack: [...project.techStack, selected] } : project
      )
    }));
  };

  const handleNext = () => {
    const tabs = ["registration", "education", "longer-tab", "Preview"];
    const currentIndex = tabs.indexOf(activeKey);
    if (currentIndex < tabs.length - 1) setActiveKey(tabs[currentIndex + 1]);
  };

  const FormInput = ({ label, name, value, disabled = false, type = "text", placeholder, onChange }) => (
    <div>
      <label className={label === "Name" ? "" : "mt-3"} style={labelStyle}>{label}</label>
      <br />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange || handleInputChange}
        style={inputStyle}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );

  const SkillSelector = ({ label, value, setValue, buttonName }) => (
    <div>
      <label style={labelStyle} className={label.includes("To Learn") ? "mt-3" : ""}>{label}</label>
      <br />
      <Form.Select value={value} onChange={(e) => setValue(e.target.value)}>
        <option>Select some skill</option>
        {skills.map((skill, i) => <option key={i} value={skill}>{skill}</option>)}
      </Form.Select>
      <button className="btn btn-primary mt-3 ms-1" name={buttonName} onClick={handleAddSkill}>Add Skill</button>
    </div>
  );

  return (
    <div className="register_page ">
      <h1 className="m-4" style={{ fontFamily: "Oswald", color: "#3BB4A1" }}>
        Registration Form
      </h1>
      {loading ? (
        <div className="row m-auto w-100 d-flex justify-content-center align-items-center" style={{ height: "80.8vh" }}>
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="register_section mb-3">
          <Tabs
            defaultActiveKey="registration"
            id="justify-tab-example"
            className="mb-3"
            activeKey={activeKey}
            onSelect={(k) => setActiveKey(k)}
          >
            <Tab eventKey="registration" title="Registration">
              <FormInput label="Name" name="username" value={form.name} disabled />
              <FormInput label="Email" name="email" value={form.email} disabled />
              <FormInput label="Username" name="username" value={form.username} placeholder="Enter your username" />
              <FormInput label="Linkedin Link" name="linkedinLink" value={form.linkedinLink} placeholder="Enter your Linkedin link" />
              <FormInput label="Github Link" name="githubLink" value={form.githubLink} placeholder="Enter your Github link" />
              <FormInput label="Portfolio Link" name="portfolioLink" value={form.portfolioLink} placeholder="Enter your portfolio link" />
              
              <SkillSelector label="Skills Proficient At" value={skillsProficientAt} setValue={setSkillsProficientAt} buttonName="skill_proficient_at" />
              {form.skillsProficientAt.length > 0 && (
                <div className="mt-2">
                  {form.skillsProficientAt.map((skill, i) => <Badge key={i} bg="secondary" className="ms-1">{skill}</Badge>)}
                </div>
              )}
              
              <SkillSelector label="Skills To Learn" value={skillsToLearn} setValue={setSkillsToLearn} buttonName="skill_to_learn" />
              {form.skillsToLearn.length > 0 && (
                <div className="mt-2">
                  {form.skillsToLearn.map((skill, i) => <Badge key={i} bg="secondary" className="ms-1">{skill}</Badge>)}
                </div>
              )}
              
              <div className="row my-2 d-flex justify-content-center">
                <button className="btn btn-warning" onClick={handleSaveRegistration} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">Next</button>
              </div>
            </Tab>
            <Tab eventKey="education" title="Education">
              {form.education.map((edu, index) => (
                <div className="border border-dark rounded-1 p-3 m-1" key={edu.id}>
                  {index !== 0 && (
                    <span className="w-100 d-flex justify-content-end">
                      <button className="w-25" onClick={() => handleRemoveEducation(edu.id)}>×</button>
                    </span>
                  )}
                  <FormInput label="Institution Name" value={edu.institution} onChange={(e) => handleEducationChange(e, index)} name="institution" placeholder="Enter your institution name" />
                  <FormInput label="Degree" value={edu.degree} onChange={(e) => handleEducationChange(e, index)} name="degree" placeholder="Enter your degree" />
                  <FormInput label="Grade/Percentage" value={edu.score} onChange={(e) => handleEducationChange(e, index)} name="score" type="number" placeholder="Enter your grade/percentage" />
                  
                  <div className="row w-100">
                    <div className="col-md-6">
                      <label className="mt-2" style={labelStyle}>Start Date</label>
                      <br />
                      <input type="date" name="startDate" value={edu.startDate ? new Date(edu.startDate).toISOString().split("T")[0] : ""} onChange={(e) => handleEducationChange(e, index)} style={inputStyle} />
                    </div>
                    <div className="col-md-6">
                      <label className="mt-2" style={labelStyle}>End Date</label>
                      <br />
                      <input type="date" name="endDate" value={edu.endDate ? new Date(edu.endDate).toISOString().split("T")[0] : ""} onChange={(e) => handleEducationChange(e, index)} style={inputStyle} />
                    </div>
                  </div>
                  
                  <FormInput label="Description" value={edu.description} onChange={(e) => handleEducationChange(e, index)} name="description" placeholder="Enter your exp or achievements" />
                </div>
              ))}
              
              <div className="row my-2 d-flex justify-content-center">
                <button className="btn btn-primary w-50" onClick={handleAddEducation}>Add Education</button>
              </div>
              
              <div className="row my-2 d-flex justify-content-center">
                <button className="btn btn-warning" onClick={handleSaveEducation} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">Next</button>
              </div>
            </Tab>
            <Tab eventKey="longer-tab" title="Additional">
              <div>
                <label style={labelStyle} className="mt-3">Bio (Max 500 Character)</label>
                <br />
                <textarea name="bio" value={form.bio} onChange={handleInputChange} style={{ ...inputStyle, marginBottom: "10px" }} placeholder="Enter your bio" />
              </div>
              
              <div>
                <label style={labelStyle}>Projects</label>
                {form.projects.map((project, index) => (
                  <div className="border border-dark rounded-1 p-3 m-1" key={project.id}>
                    <span className="w-100 d-flex justify-content-end">
                      <button className="w-25" onClick={() => handleRemoveProject(project.id)}>×</button>
                    </span>
                    
                    <FormInput label="Title" value={project.title} onChange={(e) => handleAdditionalChange(e, index)} name="title" placeholder="Enter your project title" />
                    
                    <div>
                      <label className="mt-2" style={labelStyle}>Tech Stack</label>
                      <Form.Select value={techStack[index]} onChange={(e) => setTechStack(prev => prev.map((item, i) => i === index ? e.target.value : item))}>
                        <option>Select some Tech Stack</option>
                        {skills.map((skill, i) => <option key={i} value={skill}>{skill}</option>)}
                      </Form.Select>
                      {project.techStack.length > 0 && (
                        <div className="mt-2">
                          {project.techStack.map((skill, i) => <Badge key={i} bg="secondary" className="ms-1">{skill}</Badge>)}
                        </div>
                      )}
                      <button className="btn btn-primary mt-3 ms-1" onClick={() => handleAddTechStack(index)}>Add Tech Stack</button>
                    </div>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <label className="mt-2" style={labelStyle}>Start Date</label>
                        <br />
                        <input type="date" name="startDate" value={project.startDate ? new Date(project.startDate).toISOString().split("T")[0] : ""} onChange={(e) => handleAdditionalChange(e, index)} style={inputStyle} />
                      </div>
                      <div className="col-md-6">
                        <label className="mt-2" style={labelStyle}>End Date</label>
                        <br />
                        <input type="date" name="endDate" value={project.endDate ? new Date(project.endDate).toISOString().split("T")[0] : ""} onChange={(e) => handleAdditionalChange(e, index)} style={inputStyle} />
                      </div>
                    </div>
                    
                    <FormInput label="Project Link" value={project.projectLink} onChange={(e) => handleAdditionalChange(e, index)} name="projectLink" placeholder="Enter your project link" />
                    <FormInput label="Description" value={project.description} onChange={(e) => handleAdditionalChange(e, index)} name="description" placeholder="Enter your project description" />
                  </div>
                ))}
                
                <div className="row my-2 d-flex justify-content-center">
                  <button className="btn btn-primary w-50" onClick={handleAddProject}>Add Project</button>
                </div>
              </div>
              
              <div className="row my-2 d-flex justify-content-center">
                <button className="btn btn-warning" onClick={handleSaveAdditional} disabled={saveLoading}>
                  {saveLoading ? <Spinner animation="border" variant="primary" /> : "Save"}
                </button>
                <button onClick={handleNext} className="mt-2 btn btn-primary">Next</button>
              </div>
            </Tab>
            <Tab eventKey="Preview" title="Confirm Details">
              <div>
                <h3 style={{ color: "#3BB4A1", marginBottom: "20px" }} className="link w-100 text-center">
                  Preview of the Form
                </h3>
                <div className="previewForm" style={{ fontFamily: "Montserrat, sans-serif", color: "#2d2d2d", marginBottom: "20px" }}>
                  {[
                    { label: "Name:", value: form.name },
                    { label: "Email ID:", value: form.email },
                    { label: "Username:", value: form.username },
                    { label: "Portfolio Link:", value: form.portfolioLink },
                    { label: "Github Link:", value: form.githubLink },
                    { label: "Linkedin Link:", value: form.linkedinLink },
                    { label: "Skills Proficient At:", value: form.skillsProficientAt.join(", ") },
                    { label: "Skills To Learn:", value: form.skillsToLearn.join(", ") },
                    { label: "Bio:", value: form.bio }
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", width: "70vw", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }} className="link">
                      <span style={previewLabelStyle}>{item.label}</span>
                      <span style={{ flex: 2 }}>{item.value || "Yet to be filled"}</span>
                    </div>
                  ))}
                </div>
                <div className="row">
                  <button
                    onClick={handleSubmit}
                    style={{
                      backgroundColor: "#3BB4A1",
                      color: "white",
                      padding: "10px 20px",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    className="w-50 d-flex m-auto text-center align-content-center justify-content-center"
                  >
                    {saveLoading ? <Spinner animation="border" variant="primary" /> : "Submit"}
                  </button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Register;
