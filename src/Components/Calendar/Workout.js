import "./Calendar.css"
import { Draggable } from "react-beautiful-dnd"

function Workout({ workout, index, toggleModal, setId }) {
  function handleOpenCreateExerciseModal(workoutId) {
    toggleModal()
    setId(workoutId)
  }
  return (
    <Draggable draggableId={index.toString() + workout.name.toString()} index={workout.order}>
      {(provided) => (
        <div
          key={index}
          className="workout"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <h5 className="workout_name">{workout.name}</h5>
          {workout.exercises.length > 0 ? (
            workout.exercises.map((exercise, index) => (
              <div key={index} className="exercise">
                <div className="set_number">{`${exercise.setNumber} x`}</div>
                <div className="set_info">
                  <h6>{exercise.name}</h6>
                  <span>{exercise.setInfo}</span>
                </div>
              </div>
            ))
          ) : (
            <div></div>
          )}
          <button className="plus" onClick={() => handleOpenCreateExerciseModal(workout.id)}>
            +
          </button>
        </div>
      )}
    </Draggable>
  )
}

export default Workout
