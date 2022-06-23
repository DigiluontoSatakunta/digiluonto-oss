import PropTypes from "prop-types";
import { Controller, useFieldArray, useForm } from "react-hook-form";

import DeleteIcon from "@mui/icons-material/Delete";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";

import ListItem from "@mui/material/ListItem";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";

import ListItemAvatar from "@mui/material/ListItemAvatar";
import FormControlLabel from "@mui/material/FormControlLabel";
import QuizIcon from "@mui/icons-material/Quiz";
import { Switch } from "@mui/material";
import { TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

FieldQuestions.propTypes = {
  control: PropTypes.any.isRequired,
  append: PropTypes.func.isRequired,
  remove: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  showHelp: PropTypes.bool.isRequired,
};

export default function FieldQuestions({
  title,
  description,
  showHelp,
  control,
  getValues,
  setValue,
  register,
  activePoi,
  errors,
}) {
  return (
    <>
      <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>
      {showHelp && <Typography variant="body2">{description}</Typography>}

      <QuestionField control={control} activePoi={activePoi} />
    </>
  );
}

const QuestionField = ({ control, activePoi }) => {
  const {
    fields: questions,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "questions",
  });

  return (
    <>
      {activePoi?.questions?.length === 0 && (
        <List dense={true}>
          <ListItem
            sx={{ pl: 0, pr: 7 }}
            secondaryAction={
              <>
                <IconButton
                  disabled={questions?.length ? true : false}
                  edge="end"
                  aria-label="add"
                  onClick={() =>
                    append([
                      {
                        question: "",
                        answers: [
                          { answer: "", correctAnswer: false },
                          { answer: "", correctAnswer: false },
                        ],
                      },
                    ])
                  }
                  style={{ marginRight: 0 }}
                >
                  <AddIcon />
                </IconButton>
                <IconButton edge="end" disabled={true}>
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <QuizIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary="Et ole lisänny paikkaan kysymystä"
              secondary="Mikä hauki on.."
            />
          </ListItem>
        </List>
      )}
      <List dense={true}>
        {activePoi?.questions?.map((question, index) => {
          return (
            <ListItem
              key={`questions-${index}`}
              sx={{ pl: 0, pr: 7 }}
              secondaryAction={
                <>
                  <IconButton
                    disabled={activePoi?.questions?.length ? true : false}
                    edge="end"
                    aria-label="add"
                    onClick={() =>
                      append([
                        {
                          question: "",
                          answers: [
                            { answer: "", correctAnswer: false },
                            { answer: "", correctAnswer: false },
                          ],
                        },
                      ])
                    }
                    style={{ marginRight: 0 }}
                  >
                    <AddIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      remove(index);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemAvatar>
                <Avatar sx={{ backgroundColor: "primary.main" }}>
                  <QuizIcon />
                </Avatar>
              </ListItemAvatar>

              <ListItemText
                primary={question?.question}
                secondary={`vastaus 1: ${question?.answers[0]?.answer}`}
              />
            </ListItem>
          );
        })}
      </List>
      <FormControl
        fullWidth={true}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          mt: 2,
        }}
      >
        <List dense={true}>
          {questions?.map((item, index) => {
            return (
              <li key={item.id}>
                <Controller
                  name={`questions.${index}.question`}
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      name={`questions[${index}].question`}
                      value={value}
                      placeholder="Kysymys"
                      onChange={e => onChange(e.target.value)}
                      style={{ marginBottom: 16, width: "90%" }}
                      disabled={questions[0]?.question?.length ? true : false}
                    />
                  )}
                />
                <IconButton
                  style={{ padding: 15 }}
                  edge="end"
                  aria-label="delete"
                  onClick={() => remove(index)}
                  disabled={questions[0]?.question?.length ? true : false}
                >
                  <DeleteIcon />
                </IconButton>

                <Answers
                  nestIndex={index}
                  control={control}
                  questions={questions}
                />
              </li>
            );
          })}
        </List>
      </FormControl>
    </>
  );
};

const Answers = ({ nestIndex, control, questions }) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `questions[${nestIndex}].answers`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20, marginTop: 8 }}>
            <Typography style={{ marginBottom: 4 }} id="answers-label">
              Vastaus {k + 1}
            </Typography>
            <Controller
              name={`questions[${nestIndex}].answers[${k}].answer`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  name={`questions[${nestIndex}].answers[${k}].answer`}
                  value={value}
                  placeholder="vastaus"
                  onChange={e => onChange(e.target.value)}
                  style={{ marginBottom: 16 }}
                  disabled={questions[0]?.question?.length ? true : false}
                />
              )}
            />
            <Controller
              name={`questions[${nestIndex}].answers[${k}].correctAnswer`}
              control={control}
              render={({ field: { value, onChange } }) => (
                <>
                  <Box
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Typography id="answers-label">Oikea vastaus</Typography>
                      <FormControlLabel
                        style={{
                          marginLeft: 16,
                        }}
                        control={
                          <Switch
                            disabled={
                              questions[0]?.question?.length ? true : false
                            }
                            checked={value}
                            onChange={onChange}
                          />
                        }
                      />
                    </Box>
                    <Box>
                      <IconButton
                        edge="add"
                        aria-label="add"
                        disabled={questions[0]?.question?.length ? true : false}
                        onClick={() =>
                          append({
                            answer: "",
                            correctAnswer: false,
                          })
                        }
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => remove(k)}
                        disabled={questions[0]?.question?.length ? true : false}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                </>
              )}
            />
          </div>
        );
      })}
    </div>
  );
};
