import "./Calendar.css"
import { useState, useEffect } from "react"
import { getDaysInCurrentWeek } from "../../utils/getDaysInCurrentWeek"
import axios from "axios"
import { DragDropContext, Droppable } from "react-beautiful-dnd"
import Workout from "./Workout"
import moment from "moment"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

function Calendar() {
  const baseUrl = "http://localhost:4000/api/v1"
  /* Render Training Sessions */
  const daysInCurrentWeek = getDaysInCurrentWeek()
  const initWorkoutData = daysInCurrentWeek.map((day) => {
    day.workoutSessions = []
    return day
  })

  const [workouts, setWorkouts] = useState(initWorkoutData)
  const [isLoading, setLoading] = useState(true)
  const [rerenderCheckingVar, setRerender] = useState(false)

  useEffect(() => {
    ;(async () => {
      const data = await axios.get(`${baseUrl}/workouts`)
      const workouts = data.data
      setWorkouts(workouts.data)
      setLoading(false)
    })()
    return () => {
      setLoading(true)
    }
  }, [rerenderCheckingVar])

  /* Handle drag-and-drop gestures */
  const onDragEnd = async (result) => {
    const payload = {
      source: { order: result.source.index, date: result.source.droppableId },
      destination: { order: result.destination.index, date: result.destination.droppableId },
    }
    if (
      payload.source.order.toString() + payload.source.date !==
      payload.destination.order.toString() + payload.destination.date
    ) {
      await axios.patch(`${baseUrl}/workout/dragAndDrop`, payload)
      setTimeout(() => setRerender(!rerenderCheckingVar), 500)
    }
  }

  /* Create Exercise */
  const [idWorkoutSubmit, setIdWorkoutSubmit] = useState()
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const setId = (id) => setIdWorkoutSubmit(id)
  const handleCreateExercise = async () => {
    const exerciseName = document.getElementById("exerciseName")
    const exerciseSetNumber = document.getElementById("exerciseSetNumber")
    const exerciseSetInfo = document.getElementById("exerciseSetInfo")
    if (exerciseName.value && exerciseSetNumber.value && exerciseSetInfo.value) {
      await axios.post(`${baseUrl}/workout/${idWorkoutSubmit}/exercise/create`, {
        exerciseName: exerciseName.value,
        exerciseSetNumber: exerciseSetNumber.value,
        exerciseSetInfo: exerciseSetInfo.value,
      })
    }

    setRerender(!rerenderCheckingVar)
    setShow(false)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="calendar">
        {workouts.map((data, index) => (
          <div key={index} className="day">
            <div className="day_of_the_week">{data.dayOfTheWeek}</div>
            <Droppable droppableId={data.dayOfTheMonth.toString()}>
              {(provided) => (
                <div className="day_workout" ref={provided.innerRef} {...provided.droppableProps}>
                  <div
                    className={`day_of_the_month ${
                      moment().format("YYYY/MM/DD") === data.dayOfTheMonth ? "active" : ""
                    }`}
                  >
                    {isLoading ? data.dayOfTheMonth : moment(data.dayOfTheMonth, "YYYY/MM/DD").format("DD/MM")}
                  </div>
                  {isLoading ? (
                    <h5 className="loading">Loading...</h5>
                  ) : (
                    <>
                      {data.workoutSessions.length > 0 ? (
                        data.workoutSessions.map((workout, index) => (
                          <Workout
                            key={index}
                            workout={workout}
                            index={index}
                            toggleModal={handleShow}
                            setId={setId}
                          ></Workout>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
      {/* Modal */}
      <>
        {/* <Button variant="primary" onClick={handleShow}>
          Launch demo modal
        </Button> */}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Exercise</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3" controlId="exerciseName">
                <Form.Label>Exercise Name</Form.Label>
                <Form.Control type="text" placeholder="Bench Press Medium Grip" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exerciseSetNumber">
                <Form.Label>Exercise Set Number</Form.Label>
                <Form.Control type="number" placeholder="3" autoFocus />
              </Form.Group>
              <Form.Group className="mb-3" controlId="exerciseSetInfo">
                <Form.Label>Exercise Set information</Form.Label>
                <Form.Control as="textarea" placeholder="50 lb x 9, 60 lb x 7, 70 lb x 5" rows={2} />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCreateExercise}>
              Create
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </DragDropContext>
  )
}

export default Calendar
