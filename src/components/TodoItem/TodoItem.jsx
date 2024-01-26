import { useRef, useState, useEffect } from 'react';

export const TodoItem = ({
  id,
  text,
  completed,
  date,
  onRemove,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(text);

  const handleCheck = () => {
    onUpdate({
      id,
      text,
      completed: !completed,
      date,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!newText.length) {
      onRemove(id);

      return;
    }

    if (text === newText) {
      setIsEditing(false);

      return;
    }

    onUpdate({
      id,
      text: newText,
      completed,
      date,
    });

    setIsEditing(false);
  };

  const textInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
    }
  }, [isEditing]);

  return (
    <li
      className="list-group-item"
      style={{ display: 'flex', alignItems: 'center' }}
      onDoubleClick={() => setIsEditing(true)}
    >
      <input
        className="form-check-input me-3"
        type="checkbox"
        checked={completed}
        onChange={handleCheck}
      />
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          onBlur={handleSubmit}
        >
          <input
            ref={textInputRef}
            className="form-control"
            value={newText}
            onChange={event => setNewText(event.target.value)}
            style={{
              width: '546px',
            }}
          />
        </form>
      ) : (
        <>
          <span style={{ flex: 1, textDecoration: completed ? 'line-through' : 'none' }}>
            {newText}
          </span>
          <span className="mr-3">{date}</span></>
      )}
      <button
        className="fa fa-times"
        style={{ background: 'none', border: 'none', marginLeft: '1rem' }}
        onClick={() => onRemove(id)}
      />
    </li>
  );
};